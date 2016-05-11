The `alt` attribute is the HTML feature most often associated with accessibility. It’s been around since the HTML 2.0 specification ([RFC 1866](https://tools.ietf.org/html/rfc1866), finalized in 1995), [which noted](https://tools.ietf.org/html/rfc1866#section-5.10) that “user agents may process the value of the ALT attribute as an alternative to processing the image resource indicated by the SRC attribute.” In plain English, `alt` attributes were meant as fallback content for web browsers (“user agents,” in the parlance of the specification) unable to display images, which not all early web browsers could. The `alt` attribute became [formalized as an accessibility feature](http://www.w3.org/TR/WCAG10/#gl-provide-equivalents) by the World Wide Web Consortium in May 1999’s [Web Content Accessibility Guidelines 1.0](http://www.w3.org/TR/WCAG10/]) specification.

The attribute has endured in its association with accessibility, and is well known even among people with an otherwise limited knowledge of HTML. Get into a group discussion about how to best achieve accessibility on the web, and people will excitedly shout “Alt text!” or, imprecisely, “Alt tags!” (Note that `alt` is an attribute on the image tag, `<img>`, and not a tag itself.) In the extreme, `alt` attributes are mistaken for image accessibility itself: *Include `alt` attributes, and your images are accessible. Exclude them, and they’re not.*.

In this post, I will present two complementary methods for delivering accessible images on the Web. The first method addresses the longstanding accessibility problem that `alt` attributes only partially solve: preparing text-based descriptions and enhancements for all images, that serve all users. The second method builds on the first and turns to delivering images that are themselves accessible.

## Three Limitations to `alt` Attributes

You have to admire the `alt` attribute: for a simple language feature, it’s done an incredible job of encouraging people to consider accessibility when they write and design for the web. If you’re new to HTML, here is an image tag presented with an `alt` attribute:

    <img src="puppy.jpg" alt="Photo of a cute puppy." />

In the technical terms of HTML, `alt` is an attribute, as is `src` (source). `puppy.jpg` and `Photo of a cute puppy.` are referred to as values, or sometimes as attribute-values. And `img` of course is the tag, enclosed in angle brackets. (I prefer XML-style syntax, so I self-close image tags: `<img />`, but in HTML5 `<img>` is also acceptable.)

To understand why `alt` attributes alone are insufficient for accessible image presentation, consider their three limitations:

1. **Content**: HTML limits attribute values to plain text; *Photo of a cute puppy* in the example above. None of the semantic tags that make for more accessible, expressive content elsewhere in HTML can be used inside of an attribute, `alt` or otherwise. You can’t, for example, use within an attribute value an `<em>` tag for providing emphasis on a portion of your `alt` attribute’s text, such as `Photo of a <em>cute</em> puppy` (for an exceptionally cute puppy), nor can you write the `<a>` (anchor) tag to link to a fuller description of the image. [EXAMPLE]

2. **Discoverability**: an `alt` attribute’s text is not [palpable content](http://www.w3.org/TR/html5/dom.html#palpable-content), the way the text is inside HTML elements such as paragraphs or headings: `<h1>This is Palpable Content</h1>`. Ironically, the value of the `alt` attribute is *inaccessible* for many people. Unless someone is using an assistive device, like a screen reader, or viewing the page under error conditions, like when an image fails to load, the presence of `alt` text is impossible to detect without examining the source code. The contents of an `alt` attribute will not aid, as an example, someone who can read text on screen if it’s sized large enough, but who does not have the fidelity of vision to make out the finer features of a photograph, chart, map, illustration, or other visual material. Certain browsers may render the contents of the `alt` attribute when an image is hovered over, but that’s little help to people using touchscreen devices, which cannot detect a hover state of someone’s finger.

3. **Length**: certain browsers render only the first 100 or so characters of an `alt` attribute, particularly in tool-tip text shown to users upon hovering their mouse pointers over images. In testing on the most recent version of Safari on OS X (9.1), I found that `alt` text will not be displayed in place of a broken image if the text runs longer than one line within the broken image’s dimensions as specified in HTML or CSS. Keeping `alt` text accessible means keeping it short. Of course, the shorter `alt` text is, the less descriptive it can be.

Prior to HTML5, the `<img>` element had another attribute, `longdesc` (long description), which posed even more discoverability problems than `alt`, as not even an error condition revealed its presence. It was also often misused. HTML authors would stuff even more plain-text, descriptive content into the `longdesc` attribute, but the specification actually required a URL pointing to a location for the long description’s content. For those reasons, `longdesc` is [obsolete in HTML5](http://www.w3.org/TR/html-markup/img.html), with HTML authors being directed instead to provide a link to descriptive content via a vanilla anchor tag (`<a>`).

When I write `alt` attributes, I always begin with the kind of image: *Photo of...*, *Map of...*, *Chart illustrating...*, and then give the shortest possible description of what the image is. Any content beyond that is more accessibly delivered to all users, using semantic elements that I’ll describe next.

## HTML Structure Around Images

A problem with images generally is somehow structurally presenting them alongside other HTML content: the running text of an article, for example, or even with a caption or other information directly related to the image. It’s not uncommon to see markup something along the lines of:

    <div class="photo">
      <img src="flowers.jpg" alt="Photo of flowers." />
    </div>

Not only does that provide a styling hook in CSS (`div.photo` or just `.photo`), but it lends itself to including a caption of some sort in a paragraph element:

    <div class="photo">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <p>
        Flowers growing in a box just outside my office window.
      </p>
    </div>

The limitation to that markup is that `<div>` is a generic element, indicating only a division; adding a class of `photos` makes sense to human readers of the source code, but it has no special meaning to browsers or assistive devices. In the frank words of [the HTML5 specification](https://www.w3.org/TR/html5/grouping-content.html#the-div-element), “the `div` element has no special meaning at all” and therefore is “an element of last resort.” There is also no semantic indication that the paragraph inside of the `<div>` is a caption, other than its proximity in the source code. That’s not enough to make the caption’s contents fully accessible to all.

HTML5 introduced a number of [new semantic elements to replace generics like `<div>` and `<span>`](http://html5forwebdesigners.com/semantics/index.html). The element most relevant to marking up images and other media is [`<figure>`](http://www.w3.org/TR/html/grouping-content.html#the-figure-element), which is "used to annotate illustrations, diagrams, photos, code listings, etc.” `<figure>` has a semantic child element, called `<figcaption>` (figure caption). Here is the example above rewritten using the new semantic elements:

    <figure class="photo">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <figcaption>
        Flowers growing in a box just outside my office window.
      </figcaption>
    </figure>

Unlike `<div>`, `<figure>` has a clear and well understood meaning to modern browsers and assistive devices. The location of `<figcaption>`, as a child of the `<figure>` element, provides a semantic association to browsers and assistive devices that the caption is specifically for the media inside of the `<figure>` element: the `<img>` tag, in this case. And unlike the content tucked inside the `alt` attribute, the palpable content of `<figcaption>` is discoverable by all users.

## ARIA Attributes

It’s possible to enhance HTML5’s native structural associations between `<figure>` and `<figcaption>`, as well as point to related content elsewhere on the page, by including [Accessible Rich Internet Application (ARIA) attributes](http://www.w3.org/TR/wai-aria/states_and_properties). ARIA attributes are in active development by the W3C’s Web Accessibility Initiative group, the same group responsible for the Web Content Accessibility Guidelines mentioned above. There is also a specification in development for [ARIA in HTML](http://www.w3.org/TR/html-aria/), which when complete will clarify the use of ARIA alongside HTML’s native semantics. But there is no need to wait for that specification. ARIA can be used in HTML immediately.

The first ARIA attribute to enhance the example code I’ve been writing so far is [`aria-labelledby`](http://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby) (note the British English spelling of *labelled*, with two Ls). The value of that attribute must be a unique identifier assigned using the `id` attribute on some other element whose contents labels the image. In this case, the brief caption serves as the label, so I’ve added `id="flower-caption"` to `<figcaption>`, and then written `flower-caption` as the value of `aria-labelledby` on the `<figure>` element:

    <figure class="photo" aria-labelledby="flower-caption">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <figcaption id="flower-caption">
        Flowers growing in a box just outside my office window.
      </figcaption>
    </figure>

That’s looking really good. But there’s another attribute worth including: `aria-describedby`. [The WAI-ARIA spec notes](http://www.w3.org/TR/wai-aria/states_and_properties#aria-describedby) that the “`aria-labelledby` attribute is similar to `aria-describedby` in that both reference other elements to calculate a text alternative, but a label should be concise, where a description is intended to provide more verbose information.” In many cases, a fuller description would appear in the running text of the page where the image has been included.

To make that associated, descriptive information discoverable to all users, I’ve added a simple *Full description* link that points elsewhere on the page, using [the `#`-style fragment identifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id), which will scroll or otherwise point the browser to the unique ID of the element containing the image’s full content. Capable assistive devices can leverage the identifier in `aria-describedby` to the same effect:

    <figure class="photo" aria-labelledby="flower-caption" aria-describedby="flower-description">
      <img src="flowers.jpg" alt="Photo of flowers." />
      <figcaption id="flower-caption">
        Flowers growing in a box just outside my office window. <a href="#content">Full description.</a>
      </figcaption>
    </figure>
    <!-- Elsewhere on the page: -->
    <p id="flower-description">
      A lush box of purple pansies, yellow marigolds, and white alyssum look striking in
      this photo of my flower box... <!-- ...and so on -->
    </p>

Having put all of that ARIA-enhanced semantic HTML in place to make the page more accessible on a structural level, let’s look at how CSS can style these elements for sighted users.

## Foundational Styling for Newer Semantics

Older browsers do not understand how to style newer block elements like `<figure>`, so the page’s accompanying CSS should include this:

    /* CSS */
    figure,figcaption { display: block; }

Additionally, older versions of Internet Explorer cannot apply CSS to elements unknown to Internet Explorer, so it’s further necessary to bring in JavaScript to create the missing elements:

    /* JavaScript */
    document.elementCreate("figure");
    document.elementCreate("figcaption");

A more fully-featured solution to handle older versions of IE 9 and earlier would be to include [HTML5 Shiv](https://github.com/aFarkas/html5shiv), either from a copy stored on your own web server or via [cdnjs](https://cdnjs.com/libraries/html5shiv/):

    <!-- HTML -->
    <head>
      <!--
      other <head> content omitted for brevity; <script> tag
      is wrapped in conditional comments that only IE will see
      -->
      <!--[if lt IE 9]>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
      <![endif]-->
    </head>

I’ve added the following CSS to highlight the descriptive content on the page, using the `:target` pseudoclass that will be applied when someone clicks the *Full description* link. This little enhancement will be especially useful in cases where a layout would not require scrolling, and therefore leave a user wondering about the presence of an apparently non-functional link in the figure caption:

    /* CSS */
    #content:target {
      background: #DDD;
      transition: background 1s;
    }

The remaining CSS for styling images will be described below, and are available in full with the examples that accompany this post.

## Accessible Images

Now that the text content of the page has been semantically, accessibly associated with the image, I want to turn to the accessibility of the image itself. Prior to the original iPhone’s release in 2007, handling images on the web was fairly straightforward. People were generally designing fixed-with layouts, usually at about 960 pixels wide, and creating images of a specific width to fit within those layouts. That single image was referenced in HTML in the `<img>` tag’s `src` attribute. Oftentimes, the image’s dimensions were hard-coded into the HTML with `height` and `width` attributes. A pixel was a pixel, images all rendered pretty much the same size on every computer you could think of, and that was that.

But in order to make the original iPhone work with the Web of 2007, Apple designed its Safari web browser to scale down pages to appear as though the phone were 980 pixels wide: comfortable enough to fit the entire contents of ~960-pixel-wide layouts that were then all the rage. To make text readable and images fill more of the native phone viewport, users needed to double-tap on different elements on the page. Other web-enabled smartphones quickly followed Apple’s lead and rendered pages in a similar fashion. But that meant a lot of overhead in terms of the image data: a phone with native resolutions of around 320 × 480 pixels were routinely rendering images with three times as many pixels, devouring a lot of mobile data-plans in the process.

Images got even more complicated with the release of the iPhone 4, which introduced what Apple called [a Retina display](https://support.apple.com/en-us/HT202471), which roughly doubled the number of pixels per inch that made up its screen. However, even though the number of pixels increased, the device itself behaved as though it were still 320 pixels wide. That was the dawn of the pixel-doubled image, which has now gone on to be pixel-tripled on certain devices, like the iPhone 6 Plus and numerous Android devices. And far from behing a phone-only display feature, high-density displays are available all the way up to widescreen desktop scale on 4K and, in the case of the 27” Retina iMac, 5K displays.

A pixel is no longer a pixel. There are effectively two kinds of pixels in the world: hardware pixels and reference pixels (see [this post by Scott Kellum](http://alistapart.com/article/a-pixel-identity-crisis) for a rundown). Hardware pixels are the old, familiar concept of the pixel: which are the actual points of light on the screen of a given device. A 1024 × 768 monitor built in 2002 had exactly 1024 pixels/points of light across, and 768 points on the vertical. But retina displays, as Apple called them, or pixel-doubled and -tripled displays lead [the W3C to develop the concept of a reference pixel](http://www.w3.org/TR/css-values/#reference-pixel): “the visual angle of one pixel on a device with a pixel density of 96dpi and a distance from the reader of an arm’s length.”

In other words, on high-resolution devices, multiple hardware pixels must light up in order to fill the space of one reference pixel. That’s why retina displays look so crisp: multiple points of light are doing the job of a single reference pixel, meaning that the jagged stair-step look of lower-resolution displays are eliminated, provided that the device is rendering either mathematical curves, in the case of fonts, or an image of a high enough, pixel-doubled or tripled resolution.

So the challenge is to get the right-sized image, at the proper pixel density, to the correct device. Eventually we can expect a [Network Information API](https://w3c.github.io/netinfo/) that will allow users and/or their browsers to choose images based on bandwidth as well, so a pretty but unnecessary retina-quality image doesn’t eat up someone’s mobile data plan.

[HTML5](http://www.w3.org/TR/html5/), also known as [HTML: The Living Standard](https://developers.whatwg.org) or, as I like to call it, [Plain Old Semantic HTML](http://microformats.org/wiki/posh) (POSH),


Yes, you should write `alt` attributes in your `<img>` tags. But no, you must not stop there, if your aim is an accessible presentation of images on the web. The richest expressions of web accessibility are those that inclusively enrich the experience of a page or site for all users, regardless of ability.
