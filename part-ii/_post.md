# Image Accessibility, Part II: Beyond src Attributes

In [Part I one of this series](http://www.digitalrhetoriccollaborative.org/2016/06/15/image-accessibility-part-i-beyond-alt-attributes/), I looked at writing semantic HTML and ARIA attributes to take image accessibility well beyond the limitations of the `alt` attribute. Presenting images with text-based descriptions and enhancements that serve all users is an essential foundation for image accessibility. That foundation must be in place before pursuing any of the techniques in this post, which looks at the limitations of the `src` attribute for accessibly delivering images in an era of responsive web design.

To make images themselves accessible requires delivering a crisp, high-fidelity image that best suits the device and preferences of each sighted visitor to a site, but that also does not require any more bandwidth than is absolutely necessary. The accessibility challenge is therefore to deliver the right-sized image to any given device. That is a matter of understanding how screens and browsers work when displaying images, as I describe below, and what display preferences a user might specify to determine how images are presented. While the delivery of better-accessible images is currently limited to screen conditions, a [Network Information API](https://w3c.github.io/netinfo/) is in development that will allow users to specify how their browsers behave under certain network conditions as well. In the case of accessible images, that API should help ensure that a stunning but unnecessary image doesn’t consume someone’s mobile data plan or bring a slow internet connection grinding to a halt. The techniques presented below anticipate the network API, and may very well work without any further adjustment.

Before diving into the new HTML elements and the limitations of the `src` attribute that they attempt to solve, I’m going to walk through some recent history and foundational technical concepts behind bitmapped images. Many things have changed, particularly the pixel, which compound the fundamentally new approach to designing for the web known as responsive web design (RWD).

## Images and Responsive Web Design

The preparation and delivery of web images used to be simple. Web designers typically designed fixed-width page layouts, usually around 960 pixels wide. They prepared image files of a specific height and width to fit within the fixed layout and referenced the URL or path to the file in the `<img>` tag’s `src` attribute. To prevent jarring shifts in page layout once an image loaded, the image’s placeholder dimensions were often specified in `height` and `width` attributes on the `<img>` tag. On the user side, images all rendered on desk- or laptop screens with a pixel density of roughly 96 pixels per inch. So long as an image was prepared with appropriate brightness and contrast, and not excessively compressed, it was safe to consider the image more or less accessible to sighted users (colorblindness and treatment of the image’s subject matter notwithstanding).

Apple’s release of the iPhone in 2007 was also the birth of a viable mobile web, which had failed to develop in the era of feature phones. Apple’s approach to displaying fixed-width website layouts on the original 320 × 480 iPhone screen was arguably the most important design decision in pushing the mobile web forward. Specifically, Apple designed its mobile Safari web browser to behave as though the phone screen were 980 pixels wide: large enough to display the entire, zoomed-out contents of 960-pixel fixed-width layouts. iPhone users needed only to double-tap page elements or use a zoom gesture to fill more of the native phone viewport. Other smartphone browsers quickly followed Apple’s lead and rendered pages in a similar fashion. But in terms of image data, that meant a lot of overhead: phones with native resolutions of around 320 × 480 pixels were routinely loading images with three or more times as many pixels as their screens could actually display, devouring mobile data plans and degrading device and network performance in the process.

With rapid, widespread adoption of smartphones came an interest in designing websites specifically for the mobile screen. Sites with large budgets responded by creating special mobile versions of their sites. But in 2010, Ethan Marcotte introduced the concept of [responsive web design](http://alistapart.com/article/responsive-web-design). Well executed responsive web design (RWD) enables web designers to design a site from a single CSS file that will render beautifully on all screens, from the tiniest phone to a widescreen television set and everything in between. No special mobile site or mobile URL required.

Responsive web design unites three techniques: fluid grids, CSS3 media queries, and flexible images:

1. **Fluid grids** are expressed in CSS as percentages, rather than fixed pixel units, and enable text content to reflow effortlessly across screen and browser viewport sizes. Percentage units have been available from the very earliest versions of CSS. Although long championed by accessibility advocates, percentage units are accesible in terms of text line-length only within a certain, narrow range. For example, at the size of a phone screen, a single column of text should probably be close to 100% of the viewport, the technical term for the area of a browser where page content is rendered. But on even a modest-sized laptop, text areas sized to 100% of the viewport in a maximized browser window would make uncomfortably long lines of text for someone to read.
2. **Media queries**, a feature in CSS3, provide the means for browsers to apply specific CSS styles only under certain conditions, such as a minimum size of the browser’s viewport. Media queries are therefore perfect for adjusting the percentage-widths of fluid grids at different screen sizes. For example:

    /* CSS */
    /*
      Content area sized at 95% at mobile scales, outside
      of any media query:
    */
    #content {
      width: 95%;
      margin: 0 auto; /* Visually center #content area */
    }
    /*
      Query for viewports larger than 700px wide:
    */
    @media screen and (min-width: 700px) {
      /*
        if the screen is 700px or larger, size content area
        to be 66.667%:
      */
      #content {
        width: 66.667%;
        margin: 0 11.111% 0 22.222%; /* Left offset for #content area */
      }
    /*
      Closing bracket from the media query:
    */
    }

Media queries apply the CSS rules they contain only under certain conditions. In that example, `#content` is sized at 66.667% only if the browser viewport is at least 700 pixels wide. For a more accessible query, it’s generally better to specify em units rather than pixels. In most browsers, 1em = 16px, so the query could be rewritten as `(min-width: 43.75em)`. That has the advantage of drawing layouts based on how large someone has zoomed the text, an accessibility preference of the user, rather than the arbitrary pixel-width of their device. And pixel-widths of devices are exceptionally arbitrary, as [a chart of iPhone models shows](http://www.paintcodeapp.com/news/ultimate-guide-to-iphone-resolutions). In the early days of RWD, designers too often used the screen sizes of the iPhone and iPad to determine the `min-width` breakpoints of a design. A much better practice is to use something like the [responsive design mode in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Responsive_Design_Mode), specifying breakpoints based solely on stress points in the design, where elements are no longer sized appropriately or the grid begins to fall apart.

3. **Flexible images**. Flexible images require removing from image tags any `height` and `width` attributes and instead controlling the size of images purely through CSS:

    /* CSS */
    img {
      display: block;
      max-width: 100%; /* Image only as big as its containing element */
    }

Those two lines of CSS ensure that images are displayed as blocks, rather than inline (the default on most browsers), and that images never exceed the width of their containing elements, such as the `<figure>` element I described in Part I.

But before going any further on web design, I need to stop and point out about some significant changes to screens and their impact on the fundamental unit of computer displays and images: the pixel.

## Pixel Problems

The 2010 release of the iPhone 4 introduced what Apple called a [Retina display](https://support.apple.com/en-us/HT202471). On Retina displays, or what I’ll refer to from here on as high-density displays (HDDs), the number of pixels per inch that make up the device’s screen increase from a traditional 96ppi to 192ppi and beyond. The kicker is that to prevent text, icons, and images from appearing microscopic, HDDs size on-screen elements *as though* the display were a traditional 96dpi display. And that means that a pixel is no longer a pixel.

There are now effectively two kinds of pixels in the world: hardware pixels and reference pixels [This post by Scott Kellum](http://alistapart.com/article/a-pixel-identity-crisis) has a full rundown that I will only summarize here:

* **Hardware pixels** are the old, familiar concept of the pixel: the actual dots of light on the screen of a monitor or device. A standard 96ppi 1024 × 768 monitor featured exactly 1024 pixels/points of light across, and 768 points on the vertical. A 1024 × 768 image file would would perfectly cover the screen.
* **Reference pixels** are, in [the W3C’s definition](http://www.w3.org/TR/css-values/#reference-pixel), “the visual angle of one pixel on a device with a pixel density of 96dpi and a distance from the reader of an arm’s length.” Don’t try to parse that; I’ll explain. The HDD/retina display on iPhone 4 featured 640 × 960 hardware pixels. But it continued to render onscreen elements as though the display were 320 × 480. The iPhone 4 was 320 × 480 only in *reference* pixels, which meant, for example, that a comfortable-to-tap 120 × 120-pixel icon on an an older iPhone would still render at an apparent 120 × 120 size on the iPhone 4, rather than rendering at 60 × 60 in hardware pixels, which would be very difficult to tap precisely.

In other words, on high-density displays, multiple hardware pixels must light up in order to fill the space of one reference pixel. That’s why high-density displays look so crisp. Multiple points of light (hardware pixels) are doing the job of a single reference pixel, meaning that the jagged stair-step look of text found on lower-resolution displays is eliminated, provided that the device is rendering mathematical curves, as is the case with fonts as well as vector graphics.

The trouble is, bitmapped images are grids of pixels, not mathematical curves. HDD displays attempt to maintain the apparent, reference-pixel size of bitmapped image files, which are just a grid of pixels. But images lacking in enough hardware pixels looked like garbage. A perfectly crisp 320 × 480 background image on an older iPhone 3GS, whose hardware and reference pixels were matched at 320 × 480 (1:1), rendered as a blurry mess on the iPhone 4 because one pixel in the image file needed to fill the space of two reference pixels (1:2). It was the same visual consequence of using an image editor to reduce an image to half its dimensions, then blowing it back up to its original size, and introducing some pixel smoothing to avoid the blocky pixelated look of bitmapped images that have been scaled up.

To look crisp high-density displays, which are pixel-doubled (2:1) and now even pixel-tripled (3:1), bitmapped images have to match the display’s hardware pixels: a wallpaper on an iPhone 4 required an image file with 640 × 960 pixels (2:1). Same with old 120 × 120 reference-pixel app icons, which needed to be re-prepared as 240 × 240 hardware pixels in order to appear crisp at 120 × 120 reference-pixel rendering (2:1). Or in web design terms, an image file specified to display as `width: 200px` (or the `%` or `em` equivalent of 200 pixels) in CSS must be at least 400 pixels wide to look good on an HDD. CSS dimensions are in reference pixels. Image file dimensions are in hardware pixels. Fortunately, we’re about to look at some design techniques that should help relieve you of having to ponder those points very much.

## Fixing the Problems of a Single `src`

## Overcoming the Problems of Simple Scaling








