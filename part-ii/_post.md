# Part II: Better Accessible Images

It is essential to ensure that the text content of the page is semantically and accessibly associated with an image, using standard HTML features enhanced by ARIA attributes. Once that has been accomplished, there still remains an opportunity to improve the accessibility of the image itself by delivering a version of the image that is optimized for display in a specific range of screen sizes and page layouts. That can be achieved by working with two new HTML features, the `srcset` attribute and the `<picture>` tag.

## Pixels and Bitmapped Images

Prior to the iPhone’s initial release in 2007, the preparation and delivery of web images was simple. Web designers typically designed fixed-width page layouts, usually at about 960 pixels wide. They prepared image files of a specific height and width to fit within the fixed layout, referencing the location of each image file in a URL or path in the `<img>` tag’s `src` attribute. To prevent changes in layout after an image loaded, the image’s dimensions were sometimes hard-coded in `height` and `width` attributes on the `<img>` tag. Images all rendered on desk- or laptop screens with a pixel density of roughly 96 pixels per inch. A pixel was a pixel, and that was that.

But the iPhone changed that. In order to render fixed-width website layouts on the original 320 × 480 iPhone screen, Apple designed its mobile Safari web browser to behave as though the phone were 980 pixels wide: enough to display the entire, zoomed-out contents of 960-pixel-wide layouts. iPhone users needed to double-tap page elements or pull their fingers apart to zoom in on text or images to fill more of the native phone viewport. Other smartphones quickly followed Apple’s lead and rendered pages in a similar fashion. That meant a lot of overhead in terms of image data: phones with native resolutions of around 320 × 480 pixels were routinely loading images with three times as many pixels as their devices could actually display, devouring mobile data plans and degrading device performance in the process.

In 2010, Ethan Marcotte gifted the web designing world with the term [responsive web design](http://alistapart.com/article/responsive-web-design), which united three techniques–fluid grids, flexible images, and CSS3 media queries–into an approach for designing the web across screens of all sizes. Responsive web design (RWD) enables web designers to produce a site from a single set of HTML and CSS files that will render beautifully on all screens, from the tiniest phone to a widescreen television set and everything in between.

Fluid grids expressed in CSS as percentages can reflow text content effortlessly across screen and browser viewport sizes. Media queries provide the means to change up the percentage-widths of the grids at different screen sizes. For example, on a phone screen, a single column of text should probably be close to 100% of the viewport. But on even a modest-sized laptop, 100% of the viewport would make uncomfortably long lines of text for someone to read, so a two- or three-column layout might be preferable. For example:

    /* CSS */
    /*
      Content area sized at 95% at mobile scales, outside
      of any media query:
    */
    #content {
      width: 95%;
    }
    /*
      Query for viewport screens larger than 700px wide:
    */
    @media screen and (min-width: 700px) {
      /*
        if the screen is 700px or larger, size content area
        to be 66%:
      */
      #content {
        width: 66%;
      }
    }

Media queries make it possible to target certain CSS at browsers only under certain conditions. In that example, `#content` is only sized at 66% if the browser viewport is 700 pixels wide or more. (For a more accessible query, it’s generally better to query for em units rather than pixels. In most browsers, 1em = 16px, so the query could be rewritten as `(min-width: 43.75em)`. That has the advantage of drawing layouts based on how large someone has zoomed the text, rather than the pixel-width of their device.)

The `<img>` element’s `src` attribute was the Achilles heel of RWD. While media queries allow for exceptionally fine-grained control over the layout and flow of text content, the `src` attribute could point only to a single image. And that image had to look good on the massive television as well as the smallest phone screen. Most designers chose large images that looked good at the largest possible size, relying on CSS to resize image dimensions, thus making them “flexible”:

    /* CSS */
    img {
      display: block;
      max-width: 100%; /*Image only as big as its containing element*/
    }

The preparation of web images became even more complicated with the 2010 release of the iPhone 4, which introduced what Apple called a [Retina display](https://support.apple.com/en-us/HT202471). On Retina displays, or what I’ll refer to from here on as high-density displays (HDDs), the number of pixels per inch that make up the device’s screen increase from a traditional 96ppi to 192ppi and beyond. The kicker is that to prevent text, icons, and images from appearing microscopic, HDDs size on-screen elements *as though* the display were a traditional 96dpi display. And that means that a pixel is no longer a pixel.

There are effectively now two kinds of pixels in the world: hardware pixels and reference pixels ([this post by Scott Kellum](http://alistapart.com/article/a-pixel-identity-crisis) has a full rundown). Hardware pixels are the old, familiar concept of the pixel: the actual dots of light on the screen of a given device. A standard 96ppi 1024 × 768 monitor featured exactly 1024 pixels/points of light across, and 768 points on the vertical. A 1024 × 768 image file would would perfectly cover the screen.

The iPhone 4 featured 640 × 960 hardware pixels. But it continued to render onscreen elements as though the display were 320 × 480. But the iPhone 4 was 320 × 480 only in *reference* pixels, which  [the W3C has since defined](http://www.w3.org/TR/css-values/#reference-pixel) as “the visual angle of one pixel on a device with a pixel density of 96dpi and a distance from the reader of an arm’s length.” In other words, a comfortable-to-tap 120 × 120-pixel icon on an an older iPhone would still render at an apparent 120 × 120 size on the iPhone 4, rather than being reduced to an apparent 60 × 60, which is very difficult to tap. But by maintaining the apparent size of bitmapped images, which are just a matrix of pixels, a perfectly crisp 320 × 480 background image on an older iPhone 3GS, whose hardware and reference pixels were matched at 320 × 480, rendered as a blurry mess on the iPhone 4. It was the same visual consequence of blowing up an image to twice its size in an image editor, and introducing some pixel smoothing to avoid the blocky pixelated look of bitmapped images that have been scaled up. That meant that bitmapped images had to be pixel-doubled: a crisp wallpaper on an iPhone 4 required an image file with 640 × 960 pixels. Same with old 120 × 120 app icons, which needed to be re-prepared as 240 × 240 in order to appear crisp at 120 × 120 reference-pixel rendering.

In other words, on high-density displays, multiple hardware pixels must light up in order to fill the space of one reference pixel. That’s why high-density displays look so crisp. Multiple points of light (hardware pixels) are doing the job of a single reference pixel, meaning that the jagged stair-step look of text found on lower-resolution displays is eliminated, provided that the device is rendering either mathematical curves, in the case of fonts, or an image of a high enough, pixel-doubled or -tripled resolution. Image files must be prepared sensitive to *hardware* pixel dimensions, so that they look their best in their ultimate rendering as *reference* pixels.

So the challenge is to get the right-sized image, at the proper pixel density, to the correct device. Eventually we can expect a [Network Information API](https://w3c.github.io/netinfo/) that will allow users and/or their browsers to choose images based on bandwidth as well, so that a stunning but unnecessary retina-quality image doesn’t consume someone’s mobile data plan.