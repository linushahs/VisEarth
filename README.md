VisEarth
=====

"VisEarth" is a project to visualize global weather conditions.

***unupdated version can be found at http://earth.nullschool.net.***

VisEarth extends on the open-source Earth project from “Null School”. Earth provides a 3d model of the Earth and overlays it with color-coded maps to visualize temperature, wind, and similar weather data. However, upon thorough brainstorming and a brief survey, our team realized that the app doesn’t provide any productive use of the data. Hence, we developed VisEarth. It fetches the data from weather APIs while also using the ones already being used in the “Earth” (referring to the app we have extended). In addition, we have equipped VisEarth with visualization tools so that users can draw better insights by analyzing historical trends of various weather data types.
 
Moreover, our visualization tools are dynamic and updated according to user requirements. 


building and launching
----------------------

After installing node.js and npm, clone "earth" and install dependencies:

    git clone https://github.com/linushahs/VisEarth
    cd earth
    npm install

Next, launch the development web server:

    node dev-server.js 8080

Finally, point your browser to:

    http://localhost:8080

The server acts as a stand-in for static S3 bucket hosting and so contains almost no server-side logic. It
serves all files located in the `earth/public` directory. See `public/index.html` and `public/libs/earth/*.js`
for the main entry points. Data files are located in the `public/data` directory, and there is one sample
weather layer located at `data/weather/current`.

*For Ubuntu, Mint, and elementary OS, use `nodejs` instead of `node` instead due to a [naming conflict](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager#ubuntu-mint-elementary-os).

How does it work?
----------------

Upon opening our software, a user sees a globe color-coded and animated according to the weather data. Now, the user can either click on any point of the globe or manually latitude, longitude, and time frame for data visualization. After submitting the values, a bar graph and line graph will be generated, which will be available for download.
A JavaScript code available in the GitHub repository generates the 3D globe. It uses Space Agencies data and converts it into a custom extension (.epax) for easier overlaying around the 3D globe. For Graphical Visualization, the same data is used for some instances. Elsewise, the data is fetched from a free and open-source API endpoint mentioned in the resources section below. Finally, the GET request is sent according to the user-input values, and the Graphs are rendered.




implementation notes
--------------------

Building this project required solutions to some interesting problems. Here are a few:

   * The GFS grid has a resolution of 1°. Intermediate points are interpolated in the browser using [bilinear
     interpolation](http://en.wikipedia.org/wiki/Bilinear_interpolation). This operation is quite costly.
   * Each type of projection warps and distorts the earth in a particular way, and the degree of distortion must
     be calculated for each point (x, y) to ensure wind particle paths are rendered correctly. For example,
     imagine looking at a globe where a wind particle is moving north from the equator. If the particle starts
     from the center, it will trace a path straight up. However, if the particle starts from the globe's edge,
     it will trace a path that curves toward the pole. [Finite difference approximations](http://gis.stackexchange.com/a/5075/23451)
     are used to estimate this distortion during the interpolation process.
   * The SVG map of the earth is overlaid with an HTML5 Canvas, where the animation is drawn. Another HTML5
     Canvas sits on top and displays the colored overlay. Both canvases must know where the boundaries of the
     globe are rendered by the SVG engine, but this pixel-for-pixel information is difficult to obtain directly
     from the SVG elements. To workaround this problem, the globe's bounding sphere is re-rendered to a
     detached Canvas element, and the Canvas' pixels operate as a mask to distinguish points that lie outside
     and inside the globe's bounds.
   * Most configuration options are persisted in the hash fragment to allow deep linking and back-button
     navigation. I use a [backbone.js Model](http://backbonejs.org/#Model) to represent the configuration.
     Changes to the model persist to the hash fragment (and vice versa) and trigger "change" events which flow to
     other components.
   * Components use [backbone.js Events](http://backbonejs.org/#Events) to trigger changes in other downstream
     components. For example, downloading a new layer produces a new grid, which triggers reinterpolation, which
     in turn triggers a new particle animator. Events flow through the page without much coordination,
     sometimes causing visual artifacts that (usually) quickly disappear.
   * There's gotta be a better way to do this. Any ideas?

inspiration
-----------

The awesome [hint.fm wind map](http://hint.fm/wind/) and [D3.js visualization library](http://d3js.org) provided
the main inspiration for this project.
