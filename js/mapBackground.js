/**
 * MapBackground - Adds a Gaode (Amap) static map image as a background
 * layer behind the draw.io canvas.
 *
 * Usage:
 *   1. Set MapBackground.API_KEY to your Gaode Web Service API key
 *   2. Create instance after graph.init(): new MapBackground(editorUi)
 *
 * The map fills the visible canvas area on initialization and stays
 * synchronized with canvas zoom/pan via CSS transforms. The static
 * map image is requested once; all subsequent zoom/pan adjustments
 * are purely CSS-based.
 *
 * @param {EditorUi} editorUi  The draw.io EditorUi instance
 */
var MapBackground = function(editorUi)
{
	this.editorUi = editorUi;
	this.graph = editorUi.editor.graph;
	this.mapElement = null;

	// Initial view state captured at creation time.
	// All subsequent transforms are computed relative to these values.
	this.initScale = null;
	this.initTranslateX = null;
	this.initTranslateY = null;
	this.initScrollLeft = null;
	this.initScrollTop = null;

	this.init();
};

/**
 * ============================================================
 *  CONFIGURATION — Set your Gaode API key here
 *  Apply at: https://console.amap.com/dev/key/app
 * ============================================================
 */
MapBackground.API_KEY = '01a8dff349c6db563e3d4338af8f8e40';

/**
 * Default map center coordinates (longitude,latitude).
 * Default: Beijing, China (Tiananmen Square area).
 */
MapBackground.DEFAULT_LOCATION = '116.397428,39.90923';

/**
 * Map zoom level for the static image request (1–17).
 * 11 gives a good city-level overview of Beijing.
 */
MapBackground.DEFAULT_ZOOM = 11;

/**
 * Initialize the map background layer.
 */
MapBackground.prototype.init = function()
{
	var self = this;
	var graph = this.graph;
	var container = graph.container;

	if (container == null)
	{
		return;
	}

	// Capture initial view state for transform reference
	this.initScale = graph.view.scale;
	this.initTranslateX = graph.view.translate.x;
	this.initTranslateY = graph.view.translate.y;
	this.initScrollLeft = container.scrollLeft;
	this.initScrollTop = container.scrollTop;

	// Use scrollWidth/scrollHeight to match the full scrollable canvas area
	var cw = container.scrollWidth;
	var ch = container.scrollHeight;

	// Create map image element
	var img = document.createElement('img');
	img.setAttribute('alt', '');
  img.id = 'gaode-map';
	img.style.position = 'absolute';
	img.style.left = '0';
	img.style.top = '0';
	img.style.width = cw + 'px';
	img.style.height = ch + 'px';
	// Ensure the static map image fills the element regardless of aspect ratio
	img.style.objectFit = 'cover';
	img.style.transformOrigin = '0 0';
	img.style.pointerEvents = 'none';
	img.style.userSelect = 'none';
	img.draggable = false;
	img.src = this.buildMapUrl(cw, ch);
	this.mapElement = img;

	// Insert as first child of the diagram container.
	// Position: absolute elements stack by DOM order (later = on top),
	// so the SVG canvas (inserted after) renders above the map.
	if (container.firstChild)
	{
		container.insertBefore(img, container.firstChild);
	}
	else
	{
		container.appendChild(img);
	}

	// Listen for view state changes (zoom, pan via translate)
	var handler = function() { self.updateTransform(); };

	graph.view.addListener(mxEvent.SCALE, handler);
	graph.view.addListener(mxEvent.TRANSLATE, handler);
	graph.view.addListener(mxEvent.SCALE_AND_TRANSLATE, handler);

	// Listen for fast zoom preview (CSS-based zoom before final SCALE event).
	// During preview, draw.io applies CSS scale(f) with a specific origin to
	// the SVG groups. We must apply the same transform to the map element so
	// it tracks immediately without waiting for the debounced actual zoom.
	graph.addListener('zoomPreview', function(sender, evt)
	{
		self.applyZoomPreview(evt.getProperty('factor'));
	});

	// When preview completes, the actual SCALE event fires and we reset to
	// normal transform-based tracking.
	graph.addListener('zoomPreviewComplete', function()
	{
		self.clearZoomPreview();
	});

	// Apply initial transform (identity at creation, but safe to call)
	this.updateTransform();
};

/**
 * Build the Gaode static map API URL.
 *
 * Requests the largest image within API limits (max 1024×1024)
 * with scale=2 for high-DPI quality (actual image is 2048×2048).
 *
 * @param {number} containerW  Container width in pixels
 * @param {number} containerH  Container height in pixels
 * @returns {string} The complete API URL
 */
MapBackground.prototype.buildMapUrl = function(containerW, containerH)
{
	// API max size is 1024*1024; with scale=2 the actual pixels double
	var w = Math.min(1024, containerW);
	var h = Math.min(1024, containerH);

	return 'https://restapi.amap.com/v3/staticmap' +
		'?location=' + MapBackground.DEFAULT_LOCATION +
		'&zoom=' + MapBackground.DEFAULT_ZOOM +
		'&size=' + w + '*' + h +
		'&scale=2' +
		'&key=' + MapBackground.API_KEY;
};

/**
 * Update the map element's CSS transform to match the current view state.
 *
 * Scroll-based panning (scrollbar mode) is handled automatically by the
 * browser — position:absolute elements scroll with the container content.
 */
MapBackground.prototype.updateTransform = function()
{
	if (this.mapElement == null)
	{
		return;
	}

	var container = this.graph.container;
	var scale = this.graph.view.scale;
	var tx = this.graph.view.translate.x;
	var ty = this.graph.view.translate.y;

	var r = scale / this.initScale;
	var offsetX = this.initScrollLeft * r + (tx - this.initTranslateX) * scale;
	var offsetY = this.initScrollTop * r + (ty - this.initTranslateY) * scale;

	// Also update element dimensions to track canvas resize
	this.mapElement.style.width = container.scrollWidth + 'px';
	this.mapElement.style.height = container.scrollHeight + 'px';

	this.mapElement.style.transform =
		'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + r + ')';
};

/**
 * Apply the fast zoom preview transform. This mirrors the CSS transform
 * that draw.io applies to the SVG canvas groups during the zoom gesture,
 * so the map tracks the canvas in real-time without any visible lag.
 *
 * @param {number} f  The preview scale factor (relative to current view scale)
 */
MapBackground.prototype.applyZoomPreview = function(f)
{
	if (this.mapElement == null)
	{
		return;
	}

	var graph = this.graph;
	var container = graph.container;

	// Compute the same origin that draw.io uses for the SVG groups
	var cx = container.scrollLeft + container.clientWidth / 2;
	var cy = container.scrollTop + container.clientHeight / 2;

	// Build the current base transform, then append the preview scale
	var scale = graph.view.scale;
	var tx = graph.view.translate.x;
	var ty = graph.view.translate.y;

	var r = scale / this.initScale;
	var offsetX = this.initScrollLeft * r + (tx - this.initTranslateX) * scale;
	var offsetY = this.initScrollTop * r + (ty - this.initTranslateY) * scale;

	// The preview needs to scale around the viewport center (cx, cy),
	// which is in the container's scroll coordinate space. We compose:
	//   1. translate to the base position
	//   2. scale by 'r' from origin (base zoom tracking)
	//   3. then apply the preview scale 'f' around (cx, cy)
	// Simplified: translate + scale(r) is the base, then we wrap in
	// translate(cx,cy) scale(f) translate(-cx,-cy) for preview
	this.mapElement.style.transformOrigin = '0 0';
	this.mapElement.style.transform =
		'translate(' + cx + 'px,' + cy + 'px) ' +
		'scale(' + f + ') ' +
		'translate(' + (-cx) + 'px,' + (-cy) + 'px) ' +
		'translate(' + offsetX + 'px,' + offsetY + 'px) scale(' + r + ')';
};

/**
 * Clear the zoom preview transform and return to normal tracking.
 * Called when the preview phase ends and the actual scale is applied.
 */
MapBackground.prototype.clearZoomPreview = function()
{
	// The SCALE event will fire right after and call updateTransform,
	// so we just need to let it run.
	this.updateTransform();
};

/**
 * Remove the map background and clean up resources.
 */
MapBackground.prototype.destroy = function()
{
	if (this.mapElement != null && this.mapElement.parentNode != null)
	{
		this.mapElement.parentNode.removeChild(this.mapElement);
	}

	this.mapElement = null;
};
