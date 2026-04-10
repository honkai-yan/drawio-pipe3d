# 概述

## 产品介绍

静态地图服务通过返回一张地图图片响应HTTP请求，使用户能够将高德地图以图片形式嵌入自己的网页中。用户可以指定请求的地图位置、图片大小、以及在地图上添加覆盖物，如标签、标注、折线、多边形。

静态地图在使用的过程中，需要遵守高德开放平台[《自定义地图服务协议》](https://lbs.amap.com/home/customize-map-terms/)。

## 使用限制

 服务调用量的限制请点击[这里](https://lbs.amap.com/api/webservice/guide/tools/flowlevel)查阅。 

## 使用说明

第一步，申请”Web服务API”密钥（Key）；

第二步，拼接HTTP请求URL，第一步申请的Key需作为必填参数一同发送；

第三步，接收HTTP请求返回的数据（json或xml格式），解析数据。

如无特殊声明，接口的输入参数和输出数据编码全部统一为utf-8。

## 功能介绍

| ![img](https://restapi.amap.com/v3/staticmap?location=116.37359,39.92437&zoom=10&size=440*280&markers=mid,,A:116.37359,39.92437&key=ee95e52bf08006f63fd29bcfbcf21df0)**添加默认标签** | ![img](https://restapi.amap.com/v3/staticmap?zoom=10&size=440*280&markers=-1,https://cache.amap.com/lbs/static/cuntom_marker1.png,0:116.396713,39.91474&key=ee95e52bf08006f63fd29bcfbcf21df0)**添加自定义标签** | ![img](https://restapi.amap.com/v3/staticmap?location=116.48482,39.94858&zoom=10&size=440*280&labels=%E6%9C%9D%E9%98%B3%E5%85%AC%E5%9B%AD,2,0,16,0xFFFFFF,0x008000:116.48482,39.94858&key=ee95e52bf08006f63fd29bcfbcf21df0)**添加标注** |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| ![img](https://restapi.amap.com/v3/staticmap?zoom=15&size=440*280&paths=5,0x0000FF,1,,:116.31604,39.96491;116.320816,39.966606;116.321785,39.966827;116.32361,39.966957&key=ee95e52bf08006f63fd29bcfbcf21df0)**添加折线** | ![img](https://restapi.amap.com/v3/staticmap?zoom=11&size=440*280&paths=2%2c0xff0000%2c0%2c0xFFD700%2c0.4:116.459198%2c40.01197%3b116.451988%2c40.000399%3b116.445808%2c39.988958%3b116.466923%2c39.975015%3b116.496792%2c40.000662%3b116.482716%2c40.012891&key=ee95e52bf08006f63fd29bcfbcf21df0)**添加多边形** | ![img](https://restapi.amap.com/v3/staticmap?scale=2&location=116.37359,39.92437&zoom=10&size=216*140&markers=mid,,A:116.37359,39.92437&key=ee95e52bf08006f63fd29bcfbcf21df0)**调用高清图** |

## 服务示例

```
https://restapi.amap.com/v3/staticmap?location=116.481485,39.990464&zoom=10&size=750*300&markers=mid,,A:116.481485,39.990464&key=<用户的key>
```

![img](https://restapi.amap.com/v3/staticmap?location=116.481485,39.990464&zoom=10&size=750*300&markers=mid,,A:116.481485,39.990464&key=ee95e52bf08006f63fd29bcfbcf21df0)

# 请求参数及用法

## OpenAPI Specification

```yaml
openapi: 3.0.1
info:
  title: ''
  description: ''
  version: 1.0.0
paths:
  /v3/staticmap:
    get:
      summary: 请求参数及用法
      deprecated: false
      description: >-
        **注：**如果有标注/标签/折线等覆盖物，则中心点（location）和地图级别（zoom）可选填。当请求中无location值时，地图区域以包含请求中所有的标注/标签/折线的几何中心为中心点；如请求中无zoom，地图区域以包含请求中所有的标注/标签/折线为准，系统计算出zoom值。


        ##### markers


        格式：

           markers=markersStyle1:location1;location2..|markersStyle2:location3;location4..|markersStyleN:locationN;locationM.. 

        *location*为经纬度信息，经纬度之间使用","分隔，不同的点使用";"分隔。
        markersStyle可以使用系统提供的样式，也可以使用自定义图片。


        *系统marersStyle*：label，font ,bold, fontSize，fontColor，background。


        | 参数名称 | 说明                                                         |
        默认值   |

        | :------- |
        :----------------------------------------------------------- | :-------
        |

        | size     | 可选值： small,mid,large                                     |
        small    |

        | color    | 选值范围：[0x000000, 0xffffff]例如：0x000000 black,0x008000
        green,0x800080 purple,0xFFFF00 yellow,0x0000FF blue,0x808080
        gray,0xffa500 orange,0xFF0000 red,0xFFFFFF white | 0xFC6054 |

        | label    | [0-9]、[A-Z]、[单个中文字] 当size为small时，图片不展现标注名。 | 无       |


        **markers示例：**
        https://restapi.amap.com/v3/staticmap?markers=mid,0xFF0000,A:116.37359,39.92437;116.47359,39.92437&key=您的key
        *自定义markersStyle*： -1，url，0。


        -1表示为自定义图片，URL为图片的网址。自定义图片只支持PNG格式。


        **markers示例：** 
        https://restapi.amap.com/v3/staticmap?markers=-1,https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png,0:116.37359,39.92437&key=您的key


        #### labels


        格式：

           labels=labelsStyle1:location1;location2..|labelsStyle2:location3;location4..|labelsStyleN:locationN;locationM.. 

        *location*为经纬度信息，经纬度之间使用","分隔，不同的点使用";"分隔。


        *labelsStyle*：label, font, bold, fontSize, fontColor, background。
        各参数使用","分隔，如有默认值则可为空。


        | 参数名称   | 说明                                                  | 默认值   |

        | :--------- | :---------------------------------------------------- |
        :------- |

        | content    | 标签内容，字符最大数目为15                            | 无       |

        | font       | 0：微软雅黑；1：宋体；2：Times New Roman;3：Helvetica | 0        |

        | bold       | 0：非粗体；1：粗体                                    | 0       
        |

        | fontSize   | 字体大小，可选值[1,72]                                | 10      
        |

        | fontColor  | 字体颜色，取值范围：[0x000000, 0xffffff]              | 0xFFFFFF |

        | background | 背景色，取值范围：[0x000000, 0xffffff]                | 0x5288d8 |


        **labels示例：**
        https://restapi.amap.com/v3/staticmap?location=116.48482,39.94858&zoom=10&size=400*400&labels=朝阳公园,2,0,16,0xFFFFFF,0x008000:116.48482,39.94858&key=您的key 


        ##### paths


        格式：   
        paths=pathsStyle1:location1;location2..|pathsStyle2:location3;location4..|pathsStyleN:locationN;locationM..   


        *location*为经纬度，经纬度之间使用","分隔，不同的点使用";"分隔。


        *pathsStyle*：weight, color, transparency, fillcolor, fillTransparency。


        | 参数名称         |
        说明                                                         | 默认值   |

        | :--------------- |
        :----------------------------------------------------------- | :-------
        |

        | weight           | 线条粗细。可选值： [2,15]                                   
        | 5        |

        | color            | 折线颜色。 选值范围：[0x000000, 0xffffff]例如：0x000000
        black,0x008000 green,0x800080 purple,0xFFFF00 yellow,0x0000FF
        blue,0x808080 gray,0xffa500 orange,0xFF0000 red,0xFFFFFF white |
        0x0000FF |

        | transparency     | 透明度。可选值[0,1]，小数后最多2位，0表示完全透明，1表示完全不透明。 | 1        |

        | fillcolor        | 多边形的填充颜色，此值不为空时折线封闭成多边形。取值规则同color | 无       |

        | fillTransparency | 填充面透明度。可选值[0,1]，小数后最多2位，0表示完全透明，1表示完全不透明。 |
        0.5      |


        **paths示例：**
        https://restapi.amap.com/v3/staticmap?zoom=15&size=500*500&paths=10,0x0000ff,1,,:116.31604,39.96491;116.320816,39.966606;116.321785,39.966827;116.32361,39.966957&key=您的key 
      tags:
        - 开发指南/基础 API 文档/静态地图
      parameters:
        - name: location
          in: query
          description: 地图中心点  中心点坐标。  规则：经度和纬度用","分隔 经纬度小数点后不得超过6位。
          required: true
          example: ''
          schema:
            type: string
        - name: zoom
          in: query
          description: 地图级别  地图缩放级别:[1,17]
          required: true
          schema:
            type: integer
        - name: size
          in: query
          description: 地图大小  图片宽度*图片高度。最大值为1024*1024
          required: false
          schema:
            type: string
        - name: scale
          in: query
          description: >-
            普通/高清  1:返回普通图； 
            2:调用高清图，图片高度和宽度都增加一倍，zoom也增加一倍（当zoom为最大值时，zoom不再改变）。
          required: false
          schema:
            type: integer
        - name: markers
          in: query
          description: 标注  使用规则见markers详细说明，标注最大数10个
          required: false
          schema:
            type: string
        - name: labels
          in: query
          description: 标签  使用规则见labels详细说明，标签最大数10个
          required: false
          schema:
            type: string
        - name: paths
          in: query
          description: 折线  使用规则见paths详细说明，折线和多边形最大数4个
          required: false
          schema:
            type: string
        - name: traffic
          in: query
          description: 交通路况标识  底图是否展现实时路况。 可选值： 0，不展现；1，展现。
          required: false
          schema:
            type: integer
        - name: sig
          in: query
          description: 数字签名  数字签名认证用户必填
          required: false
          schema:
            type: string
      responses:
        '200':
          description: ''
          content:
            application/json:
              schema:
                type: object
                properties: {}
          headers: {}
          x-apifox-name: 成功
      security: []
      x-apifox-folder: 开发指南/基础 API 文档/静态地图
      x-apifox-status: released
      x-run-in-apifox: https://app.apifox.com/web/project/759159/apis/api-14670850-run
components:
  schemas: {}
  securitySchemes:
    key:
      type: apikey
      in: query
      name: key
servers:
  - url: https://restapi.amap.com
    description: 正式环境
security: []

```
