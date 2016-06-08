# Part II: Better Accessible Images

In Part I one of this series, I looked at writing semantic HTML and ARIA attributes to take image accessibility well beyond the limitations of the `alt` attribute. Presenting images with text-based descriptions and enhancements that serve all users is an essential foundation for image accessibility. That foundation must be in place before pursuing any of the techniques in this post, which looks at the `srcset` attribute and the `<picture>` tag, two new HTML features that improve the accessibility of images themselves.

When I speak about images themselves being accessible, I’m talking about delivering a crisp, high-fidelity image that best suits the device and preferences of each sighted visitor to a site, but that also does not require any more bandwidth than is absolutely necessary. The accessibility challenge is therefore to deliver the right-sized image, at the proper pixel density, to any given device. Right now, that is a matter of understanding how screens and browsers work, and what display preferences a user might specify to determine how images are presented. A [Network Information API](https://w3c.github.io/netinfo/) is in development that will allow users and/or their browsers to choose a particular image file based on bandwidth in addition to screen conditions, so that a stunning but unnecessary image doesn’t consume someone’s mobile data plan or bring a slow internet connection grinding to a halt.

Before diving into the new HTML elements and the problems they attempt to solve, I’m going to do a little walk through recent history and examine some foundational technical concepts behind bitmapped images, particularly the pixel, as well as changes in the fundamental approach to designing for the web, under the umbrella term of responsive web design (RWD).

## Pixels and Bitmapped Images

The preparation and delivery of web images used to be simple. Web designers typically designed fixed-width page layouts, usually around 960 pixels wide. They prepared image files of a specific height and width to fit within the fixed layout and referenced the URL or path to the file in the `<img>` tag’s `src` attribute. To prevent jarring shifts in page layout after an image loaded, the image’s dimensions were often specified in `height` and `width` attributes on the `<img>` tag. On the user side, images all rendered on desk- or laptop screens with a pixel density of roughly 96 pixels per inch.

Apple’s release of the iPhone in 2007 was also the birth of a viable mobile web, which had failed to develop in the era of feature phones. Apple’s approach to displaying fixed-width website layouts on the original 320 × 480 iPhone screen was arguably the most important design decision in pushing the mobile web forward: sites could display as-is, without any effort on the part of people maintaining them. Specifically, Apple designed its mobile Safari web browser to behave as though the phone screen were 980 pixels wide: large enough to display the entire, zoomed-out contents of 960-pixel fixed-width layouts. iPhone users needed only to double-tap page elements or use a zoom gesture to fill more of the native phone viewport. Other smartphone browsers quickly followed Apple’s lead and rendered pages in a similar fashion. But that meant a lot of overhead in terms of image data: phones with native resolutions of around 320 × 480 pixels were routinely loading images with three times as many pixels as their screens could actually display, devouring mobile data plans and degrading device and network performance in the process.

[TRANSITION FROM AS-IS TO MOBILE/RESPONSIVE DESIGN]

In 2010, Ethan Marcotte introduced the concept of [responsive web design](http://alistapart.com/article/responsive-web-design), which united three techniques–fluid grids, flexible images, and CSS3 media queries–into an approach for designing the web across screens of all sizes. Responsive web design (RWD) enables web designers to produce a site from a single set of HTML and CSS files that will render beautifully on all screens, from the tiniest phone to a widescreen television set and everything in between.

Fluid grids expressed in CSS as percentages enable text content to reflow effortlessly across screen and browser viewport sizes. Media queries provide the means to change up the percentage-widths of the grids at different screen sizes. For example, on a phone screen, a single column of text should probably be close to 100% of the viewport. But on even a modest-sized laptop, 100% of the viewport would make uncomfortably long lines of text for someone to read, so a two- or three-column layout might be preferable. For example:

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
      Query for viewport screens larger than 700px wide:
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
    }

Media queries apply the CSS rules they contain only under certain conditions. In that example, `#content` is only sized at 66.667% if the browser viewport is 700 pixels wide or more. For a more accessible query, it’s generally better to query for em units rather than pixels. In most browsers, 1em = 16px, so the query could be rewritten as `(min-width: 43.75em)`. That has the advantage of drawing layouts based on how large someone has zoomed the text, an accessibility preference of the user, rather than the arbitrary pixel-width of their device.

The `<img>` element’s `src` attribute was the Achilles heel of RWD. While media queries allow for exceptionally fine-grained control over the layout and flow of text content, the `src` attribute could refer to the URL or path of only a single image. And that image had to look good on a massive television as well as the smallest phone screen. Most designers chose large images that looked good at the largest possible size, relying on CSS to resize image dimensions, thus making them “flexible”:

    /* CSS */
    img {
      display: block;
      max-width: 100%; /*Image only as big as its containing element*/
    }

The preparation of web images became even more complicated with the 2010 release of the iPhone 4, which introduced what Apple called a [Retina display](https://support.apple.com/en-us/HT202471). On Retina displays, or what I’ll refer to from here on as high-density displays (HDDs), the number of pixels per inch that make up the device’s screen increase from a traditional 96ppi to 192ppi and beyond. The kicker is that to prevent text, icons, and images from appearing microscopic, HDDs size on-screen elements *as though* the display were a traditional 96dpi display. And that means that a pixel is no longer a pixel.

There are now effectively two kinds of pixels in the world: hardware pixels and reference pixels ([this post by Scott Kellum](http://alistapart.com/article/a-pixel-identity-crisis) has a full rundown). Hardware pixels are the old, familiar concept of the pixel: the actual dots of light on the screen of a monitor or device. A standard 96ppi 1024 × 768 monitor featured exactly 1024 pixels/points of light across, and 768 points on the vertical. A 1024 × 768 image file would would perfectly cover the screen.

The iPhone 4 featured 640 × 960 hardware pixels. But it continued to render onscreen elements as though the display were 320 × 480. But the iPhone 4 was 320 × 480 only in *reference* pixels, which  [the W3C has since defined](http://www.w3.org/TR/css-values/#reference-pixel) as “the visual angle of one pixel on a device with a pixel density of 96dpi and a distance from the reader of an arm’s length.” In other words, a comfortable-to-tap 120 × 120-pixel icon on an an older iPhone would still render at an apparent 120 × 120 size on the iPhone 4, rather than rendering at 60 × 60, which would be very difficult to tap precisely. But by maintaining the apparent, reference-pixel size of bitmapped images, which are just a matrix of pixels, images lacking in hardware pixels looked like garbage. For example, a perfectly crisp 320 × 480 background image on an older iPhone 3GS, whose hardware and reference pixels were matched at 320 × 480, rendered as a blurry mess on the iPhone 4. It was the same visual consequence of blowing up an image to twice its size in an image editor, and introducing some pixel smoothing to avoid the blocky pixelated look of bitmapped images that have been scaled up. To look crisp on an iPhone 4, bitmapped images had to be pixel-doubled: a wallpaper on an iPhone 4 required an image file with 640 × 960 pixels. Same with old 120 × 120 app icons, which needed to be re-prepared as 240 × 240 in order to appear crisp at 120 × 120 reference-pixel rendering.

In other words, on high-density displays, multiple hardware pixels must light up in order to fill the space of one reference pixel. That’s why high-density displays look so crisp. Multiple points of light (hardware pixels) are doing the job of a single reference pixel, meaning that the jagged stair-step look of text found on lower-resolution displays is eliminated, provided that the device is rendering either mathematical curves, in the case of fonts, or an image of a high enough, pixel-doubled or -tripled resolution. Image files must be prepared sensitive to *hardware* pixel dimensions, so that they look their best in their ultimate rendering as *reference* pixels.






