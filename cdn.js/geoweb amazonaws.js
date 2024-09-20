/*! Esri-Leaflet - v0.0.1-beta.5 - 2014-06-16
 *   Copyright (c) 2014 Environmental Systems Research Institute, Inc.
 *   Apache License*/
(L.esri = {
  VERSION: "0.0.1-beta.5",
  Layers: {},
  Services: {},
  Controls: {},
  Tasks: {},
  Util: {},
  Support: {
    CORS: !!(
      window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest()
    ),
    pointerEvents: "" === document.documentElement.style.pointerEvents,
  },
}),
  (function (L) {
    function a(a) {
      var b = {};
      for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
      return b;
    }
    function b(a) {
      return c(a[0], a[a.length - 1]) || a.push(a[0]), a;
    }
    function c(a, b) {
      for (var c = 0; c < a.length; c++) if (a[c] !== b[c]) return !1;
      return !0;
    }
    function d(a) {
      var b,
        c = 0,
        d = 0,
        e = a.length,
        f = a[d];
      for (d; e - 1 > d; d++)
        (b = a[d + 1]), (c += (b[0] - f[0]) * (b[1] + f[1])), (f = b);
      return c >= 0;
    }
    function e(a, b, c, d) {
      var e = (d[0] - c[0]) * (a[1] - c[1]) - (d[1] - c[1]) * (a[0] - c[0]),
        f = (b[0] - a[0]) * (a[1] - c[1]) - (b[1] - a[1]) * (a[0] - c[0]),
        g = (d[1] - c[1]) * (b[0] - a[0]) - (d[0] - c[0]) * (b[1] - a[1]);
      if (0 !== g) {
        var h = e / g,
          i = f / g;
        if (h >= 0 && 1 >= h && i >= 0 && 1 >= i) return !0;
      }
      return !1;
    }
    function f(a, b) {
      for (var c = 0; c < a.length - 1; c++)
        for (var d = 0; d < b.length - 1; d++)
          if (e(a[c], a[c + 1], b[d], b[d + 1])) return !0;
      return !1;
    }
    function g(a, b) {
      for (var c = !1, d = -1, e = a.length, f = e - 1; ++d < e; f = d)
        ((a[d][1] <= b[1] && b[1] < a[f][1]) ||
          (a[f][1] <= b[1] && b[1] < a[d][1])) &&
          b[0] <
            ((a[f][0] - a[d][0]) * (b[1] - a[d][1])) / (a[f][1] - a[d][1]) +
              a[d][0] &&
          (c = !c);
      return c;
    }
    function h(a, b) {
      var c = f(a, b),
        d = g(a, b[0]);
      return !c && d ? !0 : !1;
    }
    function i(a) {
      for (var c = [], e = [], f = 0; f < a.length; f++) {
        var g = b(a[f].slice(0));
        if (!(g.length < 4))
          if (d(g)) {
            var i = [g];
            c.push(i);
          } else e.push(g);
      }
      for (; e.length; ) {
        for (var j = e.pop(), k = !1, l = c.length - 1; l >= 0; l--) {
          var m = c[l][0];
          if (h(m, j)) {
            c[l].push(j), (k = !0);
            break;
          }
        }
        k || c.push([j.reverse()]);
      }
      return 1 === c.length
        ? { type: "Polygon", coordinates: c[0] }
        : { type: "MultiPolygon", coordinates: c };
    }
    function j(a) {
      var c = [],
        e = a.slice(0),
        f = b(e.shift().slice(0));
      if (f.length >= 4) {
        d(f) || f.reverse(), c.push(f);
        for (var g = 0; g < e.length; g++) {
          var h = b(e[g].slice(0));
          h.length >= 4 && (d(h) && h.reverse(), c.push(h));
        }
      }
      return c;
    }
    function k(a) {
      for (var b = [], c = 0; c < a.length; c++)
        for (var d = j(a[c]), e = d.length - 1; e >= 0; e--) {
          var f = d[e].slice(0);
          b.push(f);
        }
      return b;
    }
    (L.esri.Util.extentToBounds = function (a) {
      var b = new L.LatLng(a.ymin, a.xmin),
        c = new L.LatLng(a.ymax, a.xmax);
      return new L.LatLngBounds(b, c);
    }),
      (L.esri.Util.boundsToExtent = function (a) {
        return {
          xmin: a.getSouthWest().lng,
          ymin: a.getSouthWest().lat,
          xmax: a.getNorthEast().lng,
          ymax: a.getNorthEast().lat,
          spatialReference: { wkid: 4326 },
        };
      }),
      (L.esri.Util.arcgisToGeojson = function (b, c) {
        var d = {};
        return (
          "number" == typeof b.x &&
            "number" == typeof b.y &&
            ((d.type = "Point"), (d.coordinates = [b.x, b.y])),
          b.points &&
            ((d.type = "MultiPoint"), (d.coordinates = b.points.slice(0))),
          b.paths &&
            (1 === b.paths.length
              ? ((d.type = "LineString"), (d.coordinates = b.paths[0].slice(0)))
              : ((d.type = "MultiLineString"),
                (d.coordinates = b.paths.slice(0)))),
          b.rings && (d = i(b.rings.slice(0))),
          (b.geometry || b.attributes) &&
            ((d.type = "Feature"),
            (d.geometry = b.geometry
              ? L.esri.Util.arcgisToGeojson(b.geometry)
              : null),
            (d.properties = b.attributes ? a(b.attributes) : null),
            b.attributes &&
              (d.id =
                b.attributes[c] || b.attributes.OBJECTID || b.attributes.FID)),
          d
        );
      }),
      (L.esri.Util.geojsonToArcGIS = function (b, c) {
        c = c || "OBJECTID";
        var d,
          e = { wkid: 4326 },
          f = {};
        switch (b.type) {
          case "Point":
            (f.x = b.coordinates[0]),
              (f.y = b.coordinates[1]),
              (f.spatialReference = e);
            break;
          case "MultiPoint":
            (f.points = b.coordinates.slice(0)), (f.spatialReference = e);
            break;
          case "LineString":
            (f.paths = [b.coordinates.slice(0)]), (f.spatialReference = e);
            break;
          case "MultiLineString":
            (f.paths = b.coordinates.slice(0)), (f.spatialReference = e);
            break;
          case "Polygon":
            (f.rings = j(b.coordinates.slice(0))), (f.spatialReference = e);
            break;
          case "MultiPolygon":
            (f.rings = k(b.coordinates.slice(0))), (f.spatialReference = e);
            break;
          case "Feature":
            b.geometry &&
              (f.geometry = L.esri.Util.geojsonToArcGIS(b.geometry, c)),
              (f.attributes = b.properties ? a(b.properties) : {}),
              b.id && (f.attributes[c] = b.id);
            break;
          case "FeatureCollection":
            for (f = [], d = 0; d < b.features.length; d++)
              f.push(L.esri.Util.geojsonToArcGIS(b.features[d], c));
            break;
          case "GeometryCollection":
            for (f = [], d = 0; d < b.geometries.length; d++)
              f.push(L.esri.Util.geojsonToArcGIS(b.geometries[d], c));
        }
        return f;
      }),
      (L.esri.Util.responseToFeatureCollection = function (a, b) {
        var c;
        if (b) c = b;
        else if (a.objectIdFieldName) c = a.objectIdFieldName;
        else if (a.fields) {
          for (var d = 0; d <= a.fields.length - 1; d++)
            if ("esriFieldTypeOID" === a.fields[d].type) {
              c = a.fields[d].name;
              break;
            }
        } else c = "OBJECTID";
        var e = { type: "FeatureCollection", features: [] },
          f = a.features || a.results;
        if (f.length)
          for (var g = f.length - 1; g >= 0; g--)
            e.features.push(L.esri.Util.arcgisToGeojson(f[g], c));
        return e;
      }),
      (L.esri.Util.cleanUrl = function (a) {
        return (
          (a = a.replace(/\s\s*/g, "")),
          "/" !== a[a.length - 1] && (a += "/"),
          a
        );
      });
  })(L),
  (function (L) {
    function a(a) {
      var b = "";
      a.f = "json";
      for (var c in a)
        if (a.hasOwnProperty(c)) {
          var d,
            e = a[c],
            f = Object.prototype.toString.call(e);
          b.length && (b += "&"),
            (d =
              "[object Array]" === f || "[object Object]" === f
                ? JSON.stringify(e)
                : "[object Date]" === f
                ? e.valueOf()
                : e),
            (b += encodeURIComponent(c) + "=" + encodeURIComponent(d));
        }
      return b;
    }
    function b(a, b) {
      var c = new XMLHttpRequest();
      return (
        (c.onerror = function () {
          a.call(
            b,
            { error: { code: 500, message: "XMLHttpRequest error" } },
            null
          );
        }),
        (c.onreadystatechange = function () {
          var d, e;
          if (4 === c.readyState) {
            try {
              d = JSON.parse(c.responseText);
            } catch (f) {
              (d = null),
                (e = {
                  code: 500,
                  message: "Could not parse response as JSON.",
                });
            }
            !e && d.error && ((e = d.error), (d = null)), a.call(b, e, d);
          }
        }),
        c
      );
    }
    var c = 0;
    (L.esri.Request = {
      post: {
        XMLHTTP: function (c, d, e, f) {
          var g = b(e, f);
          return (
            g.open("POST", c),
            g.setRequestHeader(
              "Content-Type",
              "application/x-www-form-urlencoded"
            ),
            g.send(a(d)),
            g
          );
        },
      },
      get: {
        CORS: function (c, d, e, f) {
          var g = b(e, f);
          return g.open("GET", c + "?" + a(d), !0), g.send(null), g;
        },
        JSONP: function (b, d, e, f) {
          L.esri._callback = L.esri._callback || {};
          var g = "c" + c;
          d.callback = "L.esri._callback." + g;
          var h = L.DomUtil.create("script", null, document.body);
          return (
            (h.type = "text/javascript"),
            (h.src = b + "?" + a(d)),
            (h.id = g),
            (L.esri._callback[g] = function (a) {
              if (L.esri._callback[g] !== !0) {
                var b,
                  c = Object.prototype.toString.call(a);
                "[object Object]" !== c &&
                  "[object Array]" !== c &&
                  ((b = {
                    error: {
                      code: 500,
                      message: "Expected array or object as JSONP response",
                    },
                  }),
                  (a = null)),
                  !b && a.error && ((b = a), (a = null)),
                  e.call(f, b, a),
                  (L.esri._callback[g] = !0);
              }
            }),
            c++,
            L.esri._callback[g]
          );
        },
      },
    }),
      (L.esri.get = L.esri.Support.CORS
        ? L.esri.Request.get.CORS
        : L.esri.Request.get.JSONP),
      (L.esri.post = L.esri.Request.post.XMLHTTP);
  })(L),
  (L.esri.Services.Service = L.Class.extend({
    includes: L.Mixin.Events,
    options: { proxy: !1, useCors: !0 },
    initialize: function (a, b) {
      (this.url = L.esri.Util.cleanUrl(a)),
        (this._requestQueue = []),
        (this._authenticating = !1),
        (b = L.Util.setOptions(this, b));
    },
    get: function (a, b, c, d) {
      return this._request("get", a, b, c, d);
    },
    post: function (a, b, c, d) {
      return this._request("post", a, b, c, d);
    },
    metadata: function (a, b) {
      return this._request("get", "", {}, a, b);
    },
    authenticate: function (a) {
      return (
        (this._authenticating = !1),
        (this.options.token = a),
        this._runQueue(),
        this
      );
    },
    _request: function (a, b, c, d, e) {
      this.fire("requeststart", { url: this.url + b, params: c, method: a });
      var f = this._createServiceCallback(a, b, c, d, e);
      if (
        (this.options.token && (c.token = this.options.token),
        !this._authenticating)
      ) {
        var g = this.options.proxy
          ? this.options.proxy + "?" + this.url + b
          : this.url + b;
        return "get" !== a || this.options.useCors
          ? L.esri[a](g, c, f)
          : L.esri.Request.get.JSONP(g, c, f);
      }
      this._requestQueue.push([a, b, c, d, e]);
    },
    _createServiceCallback: function (a, b, c, d, e) {
      var f = [a, b, c, d, e];
      return L.Util.bind(function (g, h) {
        !g || (499 !== g.code && 498 !== g.code)
          ? (d.call(e, g, h),
            g
              ? this.fire("requesterror", {
                  url: this.url + b,
                  params: c,
                  message: g.message,
                  code: g.code,
                  method: a,
                })
              : this.fire("requestsuccess", {
                  url: this.url + b,
                  params: c,
                  response: h,
                  method: a,
                }),
            this.fire("requestend", {
              url: this.url + b,
              params: c,
              method: a,
            }))
          : ((this._authenticating = !0),
            this._requestQueue.push(f),
            this.fire("authenticationrequired", {
              authenticate: L.Util.bind(this.authenticate, this),
            }));
      }, this);
    },
    _runQueue: function () {
      for (var a = this._requestQueue.length - 1; a >= 0; a--) {
        var b = this._requestQueue[a],
          c = b.shift();
        this[c].apply(this, b);
      }
      this._requestQueue = [];
    },
  })),
  (L.esri.Services.service = function (a, b) {
    return new L.esri.Services.Service(a, b);
  }),
  (L.esri.Services.FeatureLayer = L.esri.Services.Service.extend({
    options: { idAttribute: "OBJECTID" },
    query: function () {
      return new L.esri.Tasks.Query(this);
    },
    addFeature: function (a, b, c) {
      return (
        delete a.id,
        (a = L.esri.Util.geojsonToArcGIS(a)),
        this.post(
          "addFeatures",
          { features: [a] },
          function (a, c) {
            b.call(this, a || c.addResults[0].error, c.addResults[0]);
          },
          c
        )
      );
    },
    updateFeature: function (a, b, c) {
      return (
        (a = L.esri.Util.geojsonToArcGIS(a, this.options.idAttribute)),
        this.post(
          "updateFeatures",
          { features: [a] },
          function (a, d) {
            b.call(c, a || d.updateResults[0].error, d.updateResults[0]);
          },
          c
        )
      );
    },
    deleteFeature: function (a, b, c) {
      return this.post(
        "deleteFeatures",
        { objectIds: a },
        function (a, d) {
          b.call(c, a || d.deleteResults[0].error, d.deleteResults[0]);
        },
        c
      );
    },
  })),
  (L.esri.Services.featureLayer = function (a, b) {
    return new L.esri.Services.FeatureLayer(a, b);
  }),
  (L.esri.Services.MapService = L.esri.Services.Service.extend({
    identify: function () {
      return new L.esri.Tasks.Identify(this);
    },
  })),
  (L.esri.Services.mapService = function (a, b) {
    return new L.esri.Services.MapService(a, b);
  }),
  (L.esri.Tasks.Identify = L.Class.extend({
    initialize: function (a) {
      a.url && a.get
        ? ((this._service = a), (this.url = a.url))
        : (this.url = L.esri.Util.cleanUrl(a)),
        (this._params = { sr: 4326, layers: "all", tolerance: 3 });
    },
    on: function (a) {
      var b = L.esri.Util.boundsToExtent(a.getBounds()),
        c = a.getSize();
      return (
        (this._params.imageDisplay = [c.x, c.y, 96].join(",")),
        (this._params.mapExtent = [b.xmin, b.ymin, b.xmax, b.ymax].join(",")),
        this
      );
    },
    at: function (a) {
      return (
        (this._params.geometry = [a.lng, a.lat].join(",")),
        (this._params.geometryType = "esriGeometryPoint"),
        this
      );
    },
    layerDef: function (a, b) {
      return (
        (this._params.layerDefs = this._params.layerDefs
          ? this._params.layerDefs + ";"
          : ""),
        (this._params.layerDefs += [a, b].join(":")),
        this
      );
    },
    between: function (a, b) {
      return (this._params.time = [a.valueOf(), b.valueOf()].join(",")), this;
    },
    layers: function (a) {
      return (this._params.layers = a), this;
    },
    precision: function (a) {
      return (this._params.geometryPrecision = a), this;
    },
    simplify: function (a, b) {
      var c = Math.abs(a.getBounds().getWest() - a.getBounds().getEast());
      return (
        (this._params.maxAllowableOffset = (c / a.getSize().y) * (1 - b)), this
      );
    },
    token: function (a) {
      return (this._params.token = a), this;
    },
    tolerance: function (a) {
      return (this._params.tolerance = a), this;
    },
    run: function (a, b) {
      this._request(function (c, d) {
        a.call(b, c, d && L.esri.Util.responseToFeatureCollection(d), d);
      }, b);
    },
    _request: function (a, b) {
      this._service
        ? this._service.get("identify", this._params, a, b)
        : L.esri.get(this.url + "identify", this._params, a, b);
    },
  })),
  (L.esri.Tasks.identify = function (a, b) {
    return new L.esri.Tasks.Identify(a, b);
  }),
  (L.esri.Tasks.Query = L.Class.extend({
    initialize: function (a) {
      a.url && a.get
        ? ((this._service = a), (this.url = a.url))
        : (this.url = L.esri.Util.cleanUrl(a)),
        (this._params = { where: "1=1", outSr: 4326, outFields: "*" });
    },
    within: function (a) {
      return (
        (this._params.geometry = L.esri.Util.boundsToExtent(a)),
        (this._params.geometryType = "esriGeometryEnvelope"),
        (this._params.spatialRel = "esriSpatialRelIntersects"),
        this
      );
    },
    nearby: function (a, b) {
      return (
        (this._params.geometry = [a.lng, a.lat].join(",")),
        (this._params.geometryType = "esriGeometryPoint"),
        (this._params.spatialRel = "esriSpatialRelIntersects"),
        (this._params.units = "esriSRUnit_Meter"),
        (this._params.distance = b),
        (this._params.inSr = 4326),
        this
      );
    },
    where: function (a) {
      return (this._params.where = a.replace(/"/g, "'")), this;
    },
    offset: function (a) {
      return (this._params.offset = a), this;
    },
    limit: function (a) {
      return (this._params.limit = a), this;
    },
    between: function (a, b) {
      return (this._params.time = [a.valueOf(), b.valueOf()].join()), this;
    },
    fields: function (a) {
      return (this._params.outFields = a.join(",")), this;
    },
    precision: function (a) {
      return (this._params.geometryPrecision = a), this;
    },
    simplify: function (a, b) {
      var c = Math.abs(a.getBounds().getWest() - a.getBounds().getEast());
      return (this._params.maxAllowableOffset = (c / a.getSize().y) * b), this;
    },
    orderBy: function (a, b) {
      return (
        (b = b || "ASC"),
        (this._params.orderByFields = this._params.orderByFields
          ? this._params.orderByFields + ","
          : ""),
        (this._params.orderByFields += [a, b].join(" ")),
        this
      );
    },
    featureIds: function (a) {
      return (this._params.objectIds = a.join(",")), this;
    },
    token: function (a) {
      return (this._params.token = a), this;
    },
    run: function (a, b) {
      return (
        this._cleanParams(),
        this._request(function (c, d) {
          a.call(b, c, d && L.esri.Util.responseToFeatureCollection(d), d);
        }, b),
        this
      );
    },
    count: function (a, b) {
      return (
        this._cleanParams(),
        (this._params.returnCountOnly = !0),
        this._request(function (b, c) {
          a.call(this, b, c && c.count, c);
        }, b),
        this
      );
    },
    ids: function (a, b) {
      return (
        this._cleanParams(),
        (this._params.returnIdsOnly = !0),
        this._request(function (b, c) {
          a.call(this, b, c && c.objectIds, c);
        }, b),
        this
      );
    },
    bounds: function (a, b) {
      return (
        this._cleanParams(),
        (this._params.returnExtentOnly = !0),
        this._request(function (c, d) {
          a.call(
            b,
            c,
            d && d.extent && L.esri.Util.extentToBounds(d.extent),
            d
          );
        }, b),
        this
      );
    },
    _cleanParams: function () {
      delete this._params.returnIdsOnly,
        delete this._params.returnExtentOnly,
        delete this._params.returnCountOnly;
    },
    _request: function (a, b) {
      this._service
        ? this._service.get("query", this._params, a, b)
        : L.esri.get(this.url + "query", this._params, a, b);
    },
  })),
  (L.esri.Tasks.query = function (a, b) {
    return new L.esri.Tasks.Query(a, b);
  }),
  (function (L) {
    var a = "https:" !== window.location.protocol ? "http:" : "https:";
    (L.esri.Layers.BasemapLayer = L.TileLayer.extend({
      statics: {
        TILES: {
          Streets: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
            attributionUrl:
              "https://static.arcgis.com/attribution/World_Street_Map",
            options: {
              minZoom: 1,
              maxZoom: 19,
              subdomains: ["server", "services"],
              attribution: "Esri",
            },
          },
          Topographic: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
            attributionUrl:
              "https://static.arcgis.com/attribution/World_Topo_Map",
            options: {
              minZoom: 1,
              maxZoom: 19,
              subdomains: ["server", "services"],
              attribution: "Esri",
            },
          },
          Oceans: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
            attributionUrl:
              "https://static.arcgis.com/attribution/Ocean_Basemap",
            options: {
              minZoom: 1,
              maxZoom: 16,
              subdomains: ["server", "services"],
              attribution: "Esri",
            },
          },
          OceansLabels: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 16,
              subdomains: ["server", "services"],
            },
          },
          NationalGeographic: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 16,
              subdomains: ["server", "services"],
              attribution: "Esri",
            },
          },
          DarkGray: {
            urlTemplate:
              a +
              "//tiles{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Base_Beta/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 10,
              subdomains: ["1", "2"],
              attribution: "Esri, DeLorme, HERE",
            },
          },
          DarkGrayLabels: {
            urlTemplate:
              a +
              "//tiles{s}.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Dark_Gray_Reference_Beta/MapServer/tile/{z}/{y}/{x}",
            options: { minZoom: 1, maxZoom: 10, subdomains: ["1", "2"] },
          },
          Gray: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 16,
              subdomains: ["server", "services"],
              attribution: "Esri, NAVTEQ, DeLorme",
            },
          },
          GrayLabels: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 16,
              subdomains: ["server", "services"],
            },
          },
          Imagery: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 19,
              subdomains: ["server", "services"],
              attribution:
                "Esri, DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community",
            },
          },
          ImageryLabels: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 19,
              subdomains: ["server", "services"],
            },
          },
          ImageryTransportation: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 19,
              subdomains: ["server", "services"],
            },
          },
          ShadedRelief: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 13,
              subdomains: ["server", "services"],
              attribution: "ESRI, NAVTEQ, DeLorme",
            },
          },
          ShadedReliefLabels: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 12,
              subdomains: ["server", "services"],
            },
          },
          Terrain: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 13,
              subdomains: ["server", "services"],
              attribution: "Esri, USGS, NOAA",
            },
          },
          TerrainLabels: {
            urlTemplate:
              a +
              "//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
            options: {
              minZoom: 1,
              maxZoom: 13,
              subdomains: ["server", "services"],
            },
          },
        },
      },
      initialize: function (a, b) {
        var c;
        if ("object" == typeof a && a.urlTemplate && a.options) c = a;
        else {
          if ("string" != typeof a || !L.esri.BasemapLayer.TILES[a])
            throw new Error(
              'L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ShadedRelief", "ShadedReliefLabels", "Terrain" or "TerrainLabels"'
            );
          c = L.esri.BasemapLayer.TILES[a];
        }
        var d = L.Util.extend(c.options, b);
        L.TileLayer.prototype.initialize.call(
          this,
          c.urlTemplate,
          L.Util.setOptions(this, d)
        ),
          c.attributionUrl && this._getAttributionData(c.attributionUrl);
      },
      onAdd: function (a) {
        L.TileLayer.prototype.onAdd.call(this, a),
          a.on("moveend", this._updateMapAttribution, this);
      },
      onRemove: function (a) {
        L.TileLayer.prototype.onRemove.call(this, a),
          a.off("moveend", this._updateMapAttribution, this);
      },
      getAttribution: function () {
        var a =
            '<a href="https://developers.arcgis.com"><img src="http://js.arcgis.com/3.9/js/esri/images/map/logo-med.png" style="position:absolute; top:-38px; right:2px;"></a>',
          b =
            '<span class="esri-attributions" style="line-height:14px; vertical-align: -3px; text-overflow:ellipsis; white-space:nowrap; overflow:hidden; display:inline-block;">' +
            this.options.attribution +
            "</span>" +
            a;
        return b;
      },
      _getAttributionData: function (a) {
        L.esri.get(
          a,
          {},
          function (a, b) {
            this._attributions = [];
            for (var c = 0; c < b.contributors.length; c++)
              for (
                var d = b.contributors[c], e = 0;
                e < d.coverageAreas.length;
                e++
              ) {
                var f = d.coverageAreas[e],
                  g = new L.LatLng(f.bbox[0], f.bbox[1]),
                  h = new L.LatLng(f.bbox[2], f.bbox[3]);
                this._attributions.push({
                  attribution: d.attribution,
                  score: f.score,
                  bounds: new L.LatLngBounds(g, h),
                  minZoom: f.zoomMin,
                  maxZoom: f.zoomMax,
                });
              }
            this._attributions.sort(function (a, b) {
              return b.score - a.score;
            }),
              this._updateMapAttribution();
          },
          this
        );
      },
      _updateMapAttribution: function () {
        if (this._map && this._map.attributionControl && this._attributions) {
          for (
            var a = "",
              b = this._map.getBounds(),
              c = this._map.getZoom(),
              d = 0;
            d < this._attributions.length;
            d++
          ) {
            var e = this._attributions[d],
              f = e.attribution;
            !a.match(f) &&
              b.intersects(e.bounds) &&
              c >= e.minZoom &&
              c <= e.maxZoom &&
              (a += ", " + f);
          }
          a = a.substr(2);
          var g =
            this._map.attributionControl._container.querySelector(
              ".esri-attributions"
            );
          (g.innerHTML = a),
            (g.style.maxWidth = 0.65 * this._map.getSize().x + "px"),
            this.fire("attributionupdated", { attribution: a });
        }
      },
    })),
      (L.esri.BasemapLayer = L.esri.Layers.BasemapLayer),
      (L.esri.Layers.basemapLayer = function (a, b) {
        return new L.esri.Layers.BasemapLayer(a, b);
      }),
      (L.esri.basemapLayer = function (a, b) {
        return new L.esri.Layers.BasemapLayer(a, b);
      });
  })(L),
  (L.esri.Layers.DynamicMapLayer = L.Class.extend({
    includes: L.Mixin.Events,
    options: {
      opacity: 1,
      position: "front",
      updateInterval: 150,
      layers: !1,
      layerDefs: !1,
      timeOptions: !1,
      format: "png24",
      transparent: !0,
      f: "image",
    },
    initialize: function (a, b) {
      (this.url = L.esri.Util.cleanUrl(a)),
        (this._service = new L.esri.Services.MapService(this.url, b)),
        this._service.on(
          "authenticationrequired requeststart requestend requesterror requestsuccess",
          this._propagateEvent,
          this
        ),
        L.Util.setOptions(this, b);
    },
    onAdd: function (a) {
      if (
        ((this._map = a),
        (this._update = L.Util.limitExecByInterval(
          this._update,
          this.options.updateInterval,
          this
        )),
        a.options.crs && a.options.crs.code)
      ) {
        var b = a.options.crs.code.split(":")[1];
        (this.options.bboxSR = b), (this.options.imageSR = b);
      }
      this._popup &&
        (this._map.on("click", this._getPopupData, this),
        this._map.on("dblclick", this._resetPopupState, this)),
        this._map.addEventListener(this.getEvents(), this),
        this._update();
    },
    onRemove: function () {
      this._currentImage && this._map.removeLayer(this._currentImage),
        this._popup &&
          (this._map.off("click", this._getPopupData, this),
          this._map.off("dblclick", this._resetPopupState, this)),
        this._map.removeEventListener(this.getEvents(), this);
    },
    addTo: function (a) {
      return a.addLayer(this), this;
    },
    removeFrom: function (a) {
      return a.removeLayer(this), this;
    },
    getEvents: function () {
      var a = { moveend: this._update };
      return a;
    },
    bringToFront: function () {
      return (
        (this.options.position = "front"),
        this._currentImage && this._currentImage.bringToFront(),
        this
      );
    },
    bringToBack: function () {
      return (
        (this.options.position = "back"),
        this._currentImage && this._currentImage.bringToBack(),
        this
      );
    },
    bindPopup: function (a, b) {
      return (
        (this._shouldRenderPopup = !1),
        (this._lastClick = !1),
        (this._popup = L.popup(b)),
        (this._popupFunction = a),
        this._map &&
          (this._map.on("click", this._getPopupData, this),
          this._map.on("dblclick", this._resetPopupState, this)),
        this
      );
    },
    unbindPopup: function () {
      return (
        this._map &&
          (this._map.closePopup(this._popup),
          this._map.off("click", this._getPopupData, this),
          this._map.off("dblclick", this._resetPopupState, this)),
        (this._popup = !1),
        this
      );
    },
    getOpacity: function () {
      return this.options.opacity;
    },
    setOpacity: function (a) {
      return (this.options.opacity = a), this._currentImage.setOpacity(a), this;
    },
    getLayers: function () {
      return this.options.layers;
    },
    setLayers: function (a) {
      return (this.options.layers = a), this._update(), this;
    },
    getLayerDefs: function () {
      return this.options.layerDefs;
    },
    setLayerDefs: function (a) {
      return (this.options.layerDefs = a), this._update(), this;
    },
    getTimeOptions: function () {
      return this.options.timeOptions;
    },
    setTimeOptions: function (a) {
      return (this.options.timeOptions = a), this._update(), this;
    },
    getTimeRange: function () {
      return [this.options.from, this.options.to];
    },
    setTimeRange: function (a, b) {
      return (
        (this.options.from = a), (this.options.to = b), this._update(), this
      );
    },
    metadata: function (a, b) {
      return this._service.metadata(a, b), this;
    },
    identify: function () {
      return this._service.identify();
    },
    authenticate: function (a) {
      return this._service.authenticate(a), this;
    },
    _getPopupData: function (a) {
      var b = L.Util.bind(function (b, c, d) {
          setTimeout(
            L.Util.bind(function () {
              this._renderPopup(a.latlng, b, c, d);
            }, this),
            300
          );
        }, this),
        c = this.identify().on(this._map).at(a.latlng);
      this.options.layers &&
        c.layers("visible:" + this.options.layers.join(",")),
        c.run(b),
        (this._shouldRenderPopup = !0),
        (this._lastClick = a.latlng);
    },
    _renderPopup: function (a, b, c, d) {
      if (this._shouldRenderPopup && this._lastClick.equals(a)) {
        var e = this._popupFunction(b, c, d);
        e && this._popup.setLatLng(a).setContent(e).openOn(this._map);
      }
    },
    _resetPopupState: function (a) {
      (this._shouldRenderPopup = !1), (this._lastClick = a.latlng);
    },
    _buildExportParams: function () {
      var a = this._map.getBounds(),
        b = this._map.getSize(),
        c = this._map.options.crs.project(a._northEast),
        d = this._map.options.crs.project(a._southWest),
        e = {
          bbox: [d.x, d.y, c.x, c.y].join(","),
          size: b.x + "," + b.y,
          dpi: 96,
          format: this.options.format,
          transparent: this.options.transparent,
          bboxSR: this.options.bboxSR,
          imageSR: this.options.imageSR,
        };
      return (
        this.options.layers &&
          (e.layers = "show:" + this.options.layers.join(",")),
        this.options.layerDefs &&
          (e.layerDefs = JSON.stringify(this.options.layerDefs)),
        this.options.timeOptions &&
          (e.timeOptions = JSON.stringify(this.options.timeOptions)),
        this.options.from &&
          this.options.to &&
          (e.time =
            this.options.from.valueOf() + "," + this.options.to.valueOf()),
        this._service.options.token && (e.token = this._service.options.token),
        e
      );
    },
    _renderImage: function (a, b) {
      var c = new L.ImageOverlay(a, b, { opacity: 0 }).addTo(this._map);
      c.once(
        "load",
        function (a) {
          var c = a.target,
            d = this._currentImage;
          c._bounds.equals(b)
            ? ((this._currentImage = c),
              "front" === this.options.position
                ? this.bringToFront()
                : this.bringToBack(),
              this._currentImage.setOpacity(this.options.opacity),
              d && this._map.removeLayer(d))
            : this._map.removeLayer(c),
            this.fire("load", { bounds: b });
        },
        this
      ),
        this.fire("loading", { bounds: b });
    },
    _update: function () {
      if (this._map) {
        var a = this._map.getZoom(),
          b = this._map.getBounds();
        if (
          !this._animatingZoom &&
          !(
            (this._map._panTransition &&
              this._map._panTransition._inProgress) ||
            a > this.options.maxZoom ||
            a < this.options.minZoom
          )
        ) {
          var c = this._buildExportParams();
          "json" === this.options.f
            ? this._service.get(
                "export",
                c,
                function (a, c) {
                  this._renderImage(c.href, b);
                },
                this
              )
            : ((c.f = "image"),
              this._renderImage(
                this.url + "export" + L.Util.getParamString(c),
                b
              ));
        }
      }
    },
    _propagateEvent: function (a) {
      (a = L.extend({ layer: a.target, target: this }, a)),
        this.fire(a.type, a);
    },
  })),
  (L.esri.DynamicMapLayer = L.esri.Layers.DynamicMapLayer),
  (L.esri.Layers.dynamicMapLayer = function (a, b) {
    return new L.esri.Layers.DynamicMapLayer(a, b);
  }),
  (L.esri.dynamicMapLayer = function (a, b) {
    return new L.esri.Layers.DynamicMapLayer(a, b);
  }),
  (L.esri.Layers.TiledMapLayer = L.TileLayer.extend({
    initialize: function (a, b) {
      (b = L.Util.setOptions(this, b)),
        (this.url = L.esri.Util.cleanUrl(a)),
        (this.tileUrl = L.esri.Util.cleanUrl(a) + "tile/{z}/{y}/{x}"),
        (this._service = new L.esri.Services.MapService(this.url, b)),
        this._service.on(
          "authenticationrequired requeststart requestend requesterror requestsuccess",
          this._propagateEvent,
          this
        ),
        this.tileUrl.match("://tiles.arcgisonline.com") &&
          ((this.tileUrl = this.tileUrl.replace(
            "://tiles.arcgisonline.com",
            "://tiles{s}.arcgisonline.com"
          )),
          (b.subdomains = ["1", "2", "3", "4"])),
        L.TileLayer.prototype.initialize.call(this, this.tileUrl, b);
    },
    metadata: function (a, b) {
      return this._service.metadata(a, b), this;
    },
    identify: function () {
      return this._service.identify();
    },
    authenticate: function (a) {
      return this._service.authenticate(a), this;
    },
    _propagateEvent: function (a) {
      (a = L.extend({ layer: a.target, target: this }, a)),
        this.fire(a.type, a);
    },
  })),
  (L.esri.TiledMapLayer = L.esri.Layers.tiledMapLayer),
  (L.esri.Layers.tiledMapLayer = function (a, b) {
    return new L.esri.Layers.TiledMapLayer(a, b);
  }),
  (L.esri.tiledMapLayer = function (a, b) {
    return new L.esri.Layers.TiledMapLayer(a, b);
  }),
  (L.esri.Layers.FeatureGrid = L.Class.extend({
    includes: L.Mixin.Events,
    options: { cellSize: 512, updateInterval: 150 },
    initialize: function (a) {
      a = L.setOptions(this, a);
    },
    onAdd: function (a) {
      (this._map = a),
        (this._update = L.Util.limitExecByInterval(
          this._update,
          this.options.updateInterval,
          this
        )),
        this._map.addEventListener(this.getEvents(), this),
        this._reset(),
        this._update();
    },
    onRemove: function () {
      this._map.removeEventListener(this.getEvents(), this),
        this._removeCells();
    },
    getEvents: function () {
      var a = { viewreset: this._reset, moveend: this._update };
      return a;
    },
    addTo: function (a) {
      return a.addLayer(this), this;
    },
    removeFrom: function (a) {
      return a.removeLayer(this), this;
    },
    _reset: function () {
      this._removeCells(),
        (this._cells = {}),
        (this._activeCells = {}),
        (this._cellsToLoad = 0),
        (this._cellsTotal = 0),
        this._resetWrap();
    },
    _resetWrap: function () {
      var a = this._map,
        b = a.options.crs;
      if (!b.infinite) {
        var c = this._getCellSize();
        b.wrapLng &&
          (this._wrapLng = [
            Math.floor(a.project([0, b.wrapLng[0]]).x / c),
            Math.ceil(a.project([0, b.wrapLng[1]]).x / c),
          ]),
          b.wrapLat &&
            (this._wrapLat = [
              Math.floor(a.project([b.wrapLat[0], 0]).y / c),
              Math.ceil(a.project([b.wrapLat[1], 0]).y / c),
            ]);
      }
    },
    _getCellSize: function () {
      return this.options.cellSize;
    },
    _update: function () {
      if (this._map) {
        var a = this._map.getPixelBounds(),
          b = this._map.getZoom(),
          c = this._getCellSize();
        if (!(b > this.options.maxZoom || b < this.options.minZoom)) {
          var d = L.bounds(
            a.min.divideBy(c).floor(),
            a.max.divideBy(c).floor()
          );
          this._addCells(d), this._removeOtherCells(d);
        }
      }
    },
    _addCells: function (a) {
      var b,
        c,
        d,
        e = [],
        f = a.getCenter(),
        g = this._map.getZoom();
      for (b = a.min.y; b <= a.max.y; b++)
        for (c = a.min.x; c <= a.max.x; c++)
          (d = new L.Point(c, b)), (d.z = g), e.push(d);
      var h = e.length;
      if (0 !== h)
        for (
          this._cellsToLoad += h,
            this._cellsTotal += h,
            e.sort(function (a, b) {
              return a.distanceTo(f) - b.distanceTo(f);
            }),
            c = 0;
          h > c;
          c++
        )
          this._addCell(e[c]);
    },
    _cellCoordsToBounds: function (a) {
      var b = this._map,
        c = this.options.cellSize,
        d = a.multiplyBy(c),
        e = d.add([c, c]),
        f = b.unproject(d, a.z).wrap(),
        g = b.unproject(e, a.z).wrap();
      return new L.LatLngBounds(f, g);
    },
    _cellCoordsToKey: function (a) {
      return a.x + ":" + a.y;
    },
    _keyToCellCoords: function (a) {
      var b = a.split(":"),
        c = parseInt(b[0], 10),
        d = parseInt(b[1], 10);
      return new L.Point(c, d);
    },
    _removeOtherCells: function (a) {
      for (var b in this._cells)
        a.contains(this._keyToCellCoords(b)) || this._removeCell(b);
    },
    _removeCell: function (a) {
      var b = this._activeCells[a];
      b &&
        (delete this._activeCells[a],
        this.cellLeave && this.cellLeave(b.bounds, b.coords),
        this.fire("cellleave", { bounds: b.bounds, coords: b.coords }));
    },
    _removeCells: function () {
      for (var a in this._cells) {
        var b = this._cells[a].bounds,
          c = this._cells[a].coords;
        this.cellLeave && this.cellLeave(b, c),
          this.fire("cellleave", { bounds: b, coords: c });
      }
    },
    _addCell: function (a) {
      this._wrapCoords(a);
      var b = this._cellCoordsToKey(a),
        c = this._cells[b];
      c &&
        !this._activeCells[b] &&
        (this.cellEnter && this.cellEnter(c.bounds, a),
        this.fire("cellenter", { bounds: c.bounds, coords: a }),
        (this._activeCells[b] = c)),
        c ||
          ((c = { coords: a, bounds: this._cellCoordsToBounds(a) }),
          (this._cells[b] = c),
          (this._activeCells[b] = c),
          this.createCell && this.createCell(c.bounds, a),
          this.fire("cellcreate", { bounds: c.bounds, coords: a }));
    },
    _wrapCoords: function (a) {
      (a.x = this._wrapLng ? L.Util.wrapNum(a.x, this._wrapLng) : a.x),
        (a.y = this._wrapLat ? L.Util.wrapNum(a.y, this._wrapLat) : a.y);
    },
  })),
  (function (L) {
    function a(a) {
      this.values = a || [];
    }
    (L.esri.Layers.FeatureManager = L.esri.Layers.FeatureGrid.extend({
      options: {
        where: "1=1",
        fields: ["*"],
        from: !1,
        to: !1,
        timeField: !1,
        timeFilterMode: "server",
        simplifyFactor: 0,
        precision: 6,
      },
      initialize: function (b, c) {
        L.esri.Layers.FeatureGrid.prototype.initialize.call(this, c),
          (c = L.setOptions(this, c)),
          (this.url = L.esri.Util.cleanUrl(b)),
          (this._service = new L.esri.Services.FeatureLayer(this.url, c)),
          this._service.on(
            "authenticationrequired requeststart requestend requesterror requestsuccess",
            function (a) {
              (a = L.extend({ target: this }, a)), this.fire(a.type, a);
            },
            this
          ),
          this.options.timeField.start && this.options.timeField.end
            ? ((this._startTimeIndex = new a()), (this._endTimeIndex = new a()))
            : this.options.timeField && (this._timeIndex = new a()),
          (this._cache = {}),
          (this._currentSnapshot = []),
          (this._activeRequests = 0);
      },
      onAdd: function (a) {
        return L.esri.Layers.FeatureGrid.prototype.onAdd.call(this, a);
      },
      onRemove: function (a) {
        return L.esri.Layers.FeatureGrid.prototype.onRemove.call(this, a);
      },
      createCell: function (a, b) {
        this._requestFeatures(a, b);
      },
      _requestFeatures: function (a, b, c) {
        this._activeRequests++,
          1 === this._activeRequests && this.fire("loading", { bounds: a }),
          this._buildQuery(a).run(function (d, e, f) {
            f && f.exceededTransferLimit && this.fire("drawlimitexceeded"),
              this._activeRequests--,
              !d && e.features.length && this._addFeatures(e.features, b),
              c && c.call(this, d, e),
              this._activeRequests <= 0 && this.fire("load", { bounds: a });
          }, this);
      },
      _addFeatures: function (a, b) {
        this._cache[b] = this._cache[b] || [];
        for (var c = a.length - 1; c >= 0; c--) {
          var d = a[c].id;
          this._cache[b].push(d), this._currentSnapshot.push(d);
        }
        this.options.timeField && this._buildTimeIndexes(a),
          this.createLayers(a);
      },
      _buildQuery: function (a) {
        var b = this._service
          .query()
          .within(a)
          .where(this.options.where)
          .fields(this.options.fields)
          .precision(this.options.precision);
        return (
          this.options.simplifyFactor &&
            b.simplify(this._map, this.options.simplifyFactor),
          "server" === this.options.timeFilterMode &&
            this.options.from &&
            this.options.to &&
            b.between(this.options.from, this.options.to),
          b
        );
      },
      setWhere: function (a) {
        this.options.where = a && a.length ? a : "1=1";
        for (
          var b = [],
            c = [],
            d = 0,
            e = L.Util.bind(function (a, e) {
              if (e)
                for (var f = e.features.length - 1; f >= 0; f--)
                  c.push(e.features[f].id);
              d--,
                0 >= d &&
                  ((this._currentSnapshot = c),
                  this.removeLayers(b),
                  this.addLayers(c));
            }, this),
            f = this._currentSnapshot.length - 1;
          f >= 0;
          f--
        )
          b.push(this._currentSnapshot[f]);
        for (var g in this._activeCells) {
          d++;
          var h = this._keyToCellCoords(g),
            i = this._cellCoordsToBounds(h);
          this._requestFeatures(i, g, e);
        }
        return this;
      },
      getWhere: function () {
        return this.options.where;
      },
      getTimeRange: function () {
        return [this.options.from, this.options.to];
      },
      setTimeRange: function (a, b) {
        var c = this.options.from,
          d = this.options.to,
          e = L.Util.bind(function () {
            this._filterExistingFeatures(c, d, a, b);
          }, this);
        if (
          ((this.options.from = a),
          (this.options.to = b),
          this._filterExistingFeatures(c, d, a, b),
          "server" === this.options.timeFilterMode)
        )
          for (var f in this._activeCells) {
            var g = this._keyToCellCoords(f),
              h = this._cellCoordsToBounds(g);
            this._requestFeatures(h, f, e);
          }
      },
      refresh: function () {
        for (var a in this._activeCells) {
          var b = this._keyToCellCoords(a),
            c = this._cellCoordsToBounds(b);
          this._requestFeatures(c, a);
        }
      },
      _filterExistingFeatures: function (a, b, c, d) {
        var e =
            a && b ? this._getFeaturesInTimeRange(a, b) : this._currentSnapshot,
          f = this._getFeaturesInTimeRange(c, d);
        if (f.indexOf)
          for (var g = 0; g < f.length; g++) {
            var h = e.indexOf(f[g]);
            h >= 0 && e.splice(h, 1);
          }
        this.removeLayers(e), this.addLayers(f);
      },
      _getFeaturesInTimeRange: function (a, b) {
        var c,
          d = [];
        if (this.options.timeField.start && this.options.timeField.end) {
          var e = this._startTimeIndex.between(a, b),
            f = this._endTimeIndex.between(a, b);
          c = e.concat(f);
        } else c = this._timeIndex.between(a, b);
        for (var g = c.length - 1; g >= 0; g--) d.push(c[g].id);
        return d;
      },
      _buildTimeIndexes: function (a) {
        var b, c;
        if (this.options.timeField.start && this.options.timeField.end) {
          var d = [],
            e = [];
          for (b = a.length - 1; b >= 0; b--)
            (c = a[b]),
              d.push({
                id: c.id,
                value: new Date(c.properties[this.options.timeField.start]),
              }),
              e.push({
                id: c.id,
                value: new Date(c.properties[this.options.timeField.end]),
              });
          this._startTimeIndex.bulkAdd(d), this._endTimeIndex.bulkAdd(e);
        } else {
          var f = [];
          for (b = a.length - 1; b >= 0; b--)
            (c = a[b]),
              f.push({
                id: c.id,
                value: new Date(c.properties[this.options.timeField]),
              });
          this._timeIndex.bulkAdd(f);
        }
      },
      _featureWithinTimeRange: function (a) {
        if (!this.options.from || !this.options.to) return !0;
        var b = +this.options.from.valueOf(),
          c = +this.options.to.valueOf();
        if ("string" == typeof this.options.timeField) {
          var d = +a.properties[this.options.timeField];
          return d >= b && c >= d;
        }
        if (this.options.timeField.start && this.options.timeField.end) {
          var e = +a.properties[this.options.timeField.start],
            f = +a.properties[this.options.timeField.end];
          return (e >= b && c >= e) || (f >= b && c >= f);
        }
      },
      authenticate: function (a) {
        return this._service.authenticate(a), this;
      },
      metadata: function (a, b) {
        return this._service.metadata(a, b), this;
      },
      query: function () {
        return this._service.query();
      },
      addFeature: function (a, b, c) {
        return (
          this._service.addFeature(
            a,
            function (a, d) {
              this.refresh(), b.call(c, a, d);
            },
            this
          ),
          this
        );
      },
      updateFeature: function (a, b, c) {
        return this._service.updateFeature(
          a,
          function (a, d) {
            this.refresh(), b.call(c, a, d);
          },
          this
        );
      },
      deleteFeature: function (a, b, c) {
        return this._service.deleteFeature(
          a,
          function (a, d) {
            this.removeLayers([d.objectId]), b.call(c, a, d);
          },
          this
        );
      },
    })),
      (a.prototype._query = function (a) {
        for (var b, c, d, e = 0, f = this.values.length - 1; f >= e; )
          if (
            ((d = b = ((e + f) / 2) | 0),
            (c = this.values[Math.round(b)]),
            +c.value < +a)
          )
            e = b + 1;
          else {
            if (!(+c.value > +a)) return b;
            f = b - 1;
          }
        return ~f;
      }),
      (a.prototype.sort = function () {
        this.values
          .sort(function (a, b) {
            return +b.value - +a.value;
          })
          .reverse(),
          (this.dirty = !1);
      }),
      (a.prototype.between = function (a, b) {
        this.dirty && this.sort();
        var c = this._query(a),
          d = this._query(b);
        return 0 === c && 0 === d
          ? []
          : ((c = Math.abs(c)),
            (d = 0 > d ? Math.abs(d) : d + 1),
            this.values.slice(c, d));
      }),
      (a.prototype.bulkAdd = function (a) {
        (this.dirty = !0), (this.values = this.values.concat(a));
      });
  })(L),
  (L.esri.Layers.FeatureLayer = L.esri.Layers.FeatureManager.extend({
    statics: {
      EVENTS:
        "click dblclick mouseover mouseout mousemove contextmenu popupopen popupclose",
    },
    initialize: function (a, b) {
      L.esri.Layers.FeatureManager.prototype.initialize.call(this, a, b),
        (b = L.setOptions(this, b)),
        (this._layers = {}),
        (this._leafletIds = {}),
        (this._key =
          "c" + (1e9 * Math.random()).toString(36).replace(".", "_"));
    },
    onAdd: function (a) {
      return L.esri.Layers.FeatureManager.prototype.onAdd.call(this, a);
    },
    onRemove: function (a) {
      for (var b in this._layers) a.removeLayer(this._layers[b]);
      return L.esri.Layers.FeatureManager.prototype.onRemove.call(this, a);
    },
    createLayers: function (a) {
      for (var b = a.length - 1; b >= 0; b--) {
        var c,
          d = a[b],
          e = this._layers[d.id];
        if (
          (e && !this._map.hasLayer(e) && this._map.addLayer(e),
          e && e.setLatLngs)
        ) {
          var f = L.GeoJSON.geometryToLayer(
            d,
            this.options.pointToLayer,
            L.GeoJSON.coordsToLatLng,
            this.options
          );
          e.setLatLngs(f.getLatLngs());
        }
        e ||
          ((c = L.GeoJSON.geometryToLayer(
            d,
            this.options.pointToLayer,
            L.GeoJSON.coordsToLatLng,
            this.options
          )),
          (c.feature = d),
          (c.defaultOptions = c.options),
          (c._leaflet_id = this._key + "_" + d.id),
          (this._leafletIds[c._leaflet_id] = d.id),
          c.on(L.esri.Layers.FeatureLayer.EVENTS, this._propagateEvent, this),
          this._popup && c.bindPopup && c.bindPopup(this._popup(c.feature, c)),
          this.options.onEachFeature &&
            this.options.onEachFeature(c.feature, c),
          (this._layers[c.feature.id] = c),
          this.resetStyle(c.feature.id),
          (!this.options.timeField ||
            (this.options.timeField && this._featureWithinTimeRange(d))) &&
            this._map.addLayer(c));
      }
    },
    cellEnter: function (a, b) {
      var c = this._cellCoordsToKey(b),
        d = this._cache[c];
      if (d)
        for (var e = d.length - 1; e >= 0; e--) {
          var f = this.getFeature(d[e]);
          this._map.hasLayer(f) || this._map.addLayer(f);
        }
    },
    cellLeave: function (a, b) {
      var c = this._cellCoordsToKey(b),
        d = this._cache[c];
      if (d)
        for (var e = d.length - 1; e >= 0; e--) {
          var f = this.getFeature(d[e]);
          this._map.hasLayer(f) && this._map.removeLayer(f);
        }
    },
    addLayers: function (a) {
      for (var b = a.length - 1; b >= 0; b--) {
        var c = this._layers[a[b]];
        c && this._map.addLayer(c);
      }
    },
    removeLayers: function (a) {
      for (var b = a.length - 1; b >= 0; b--) {
        var c = this._layers[a[b]];
        c && this._map.removeLayer(c);
      }
    },
    resetStyle: function (a) {
      var b = this._layers[a];
      return (
        b &&
          ((b.options = b.defaultOptions),
          this.setFeatureStyle(b.feature.id, this.options.style)),
        this
      );
    },
    setStyle: function (a) {
      return (
        this.eachFeature(function (b) {
          this.setFeatureStyle(b.feature.id, a);
        }, this),
        this
      );
    },
    setFeatureStyle: function (a, b) {
      var c = this._layers[a];
      "function" == typeof b && (b = b(c.feature)), c.setStyle && c.setStyle(b);
    },
    bindPopup: function (a, b) {
      this._popup = a;
      for (var c in this._layers) {
        var d = this._layers[c],
          e = this._popup(d.feature, d);
        d.bindPopup(e, b);
      }
      return this;
    },
    unbindPopup: function () {
      this._popup = !1;
      for (var a in this._layers) this._layers[a].unbindPopup();
      return this;
    },
    eachFeature: function (a, b) {
      for (var c in this._layers) a.call(b, this._layers[c]);
      return this;
    },
    getFeature: function (a) {
      return this._layers[a];
    },
    _propagateEvent: function (a) {
      (a.layer = this._layers[this._leafletIds[a.target._leaflet_id]]),
        (a.target = this),
        this.fire(a.type, a);
    },
  })),
  (L.esri.FeatureLayer = L.esri.Layers.FeatureLayer),
  (L.esri.Layers.featureLayer = function (a, b) {
    return new L.esri.Layers.FeatureLayer(a, b);
  }),
  (L.esri.featureLayer = function (a, b) {
    return new L.esri.Layers.FeatureLayer(a, b);
  });
