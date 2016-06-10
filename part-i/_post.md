# Part I: Image Accessibility Beyond Alt Attributes

The `alt` attribute is the HTML feature most often associated with accessibility. It’s been around since the HTML 2.0 specification ([RFC 1866](https://tools.ietf.org/html/rfc1866), finalized in 1995), [which noted](https://tools.ietf.org/html/rfc1866#section-5.10) that “user agents may process the value of the ALT attribute as an alternative to processing the image resource indicated by the SRC attribute.” In plain English, `alt` attributes were meant as fallback content for web browsers unable to display images, which not all early web browsers could. The World Wide Web Consortium  [formalized `alt` as an accessibility feature](http://www.w3.org/TR/WCAG10/#gl-provide-equivalents)   four years later, in May 1999’s [Web Content Accessibility Guidelines 1.0](http://www.w3.org/TR/WCAG10/]) specification.

The attribute has endured in its association with accessibility, being well known even among people with an otherwise limited knowledge of HTML. Get into a group discussion about how to best achieve accessibility on the web and people will excitedly shout “Alt text!” or “Alt tags!”—although strictly speaking, `alt` is an attribute on the image tag, `<img>`. In the extreme, `alt` attributes are mistaken for image accessibility itself: *Include `alt` attributes, and your images are accessible. Exclude them, and they’re not.*

Over a series of two posts, I’m going to present two complementary approaches to delivering accessible images on the Web, based on recent advancements in the HTML5 specification. In this post, I’ll cover methods attending to the longstanding accessibility problem that `alt` attributes only partly solve: presenting images with text-based descriptions and enhancements that serve all users. The next post will focus on device- and layout-sensitive image delivery now native to HTML in order to address the overlooked problem of the accessibility of images themselves.

## Three Limitations to `alt` Attributes

You have to admire the `alt` attribute: for a simple language feature, it’s unrivaled in encouraging people to consider accessibility when they write and design for the web. If you’re new to HTML, here is an image tag presented with an `alt` attribute:

      <img src="flowers.jpg" alt="Photo of beautiful flowers." />

In the terminology of HTML, `alt` and `src` (source) are *attributes*. The quoted text `flowers.jpg` and `Photo of beautiful flowers` are *values*, sometimes referred to as attribute values. And `img` of course is an HTML element, enclosed in angle brackets to make a tag. I prefer XML-style syntax, so I self-close image tags, `<img />`, but in HTML5 `<img>`is also acceptable.

To understand why `alt` attributes alone are insufficient for accessible image presentation, consider their three limitations:

1. **Content**: HTML limits attribute values to plain text, such as *Photo of a cute puppy* in the example above. None of the semantic tags that make for structurally expressive and accessible content elsewhere in HTML can be used inside of an attribute, `alt` or otherwise. You can’t, for example, use within an attribute value an `<em>` tag for providing emphasis on a portion of your `alt` attribute’s text, such as `Photo of <em>beautiful</em> flowers` for exceptionally beautiful flowers, nor can you write the `<a>` (anchor) tag to link to a fuller description of the image from within the `alt` text. [EXAMPLE]

2. **Discoverability**: an `alt` attribute’s value is not [palpable content](http://www.w3.org/TR/html5/dom.html#palpable-content), the way the text is between opening and closing HTML tags such as paragraphs or headings: `<h1>This is Palpable Content</h1>`. Ironically, that means the `alt` attribute’s content is *inaccessible* to many people. Unless someone is using an assistive device, like a screen reader, or viewing the page under error conditions, like when an image fails to load, the presence of `alt` text is impossible to detect without examining the source code. The contents of an `alt` attribute will not aid, for example, someone who can read text on screen if the text is scaled large enough but who does not have the fidelity of vision to discern the details of a photograph, chart, map, illustration, or other visual material. Certain browsers might render the contents of the `alt` attribute when an image is hovered over with a mouse pointer, but that’s no help to people using touchscreen devices, which are incapable of detecting the hover state of someone’s finger.

3. **Length**: certain browsers render only the first 100 or so characters of an `alt` attribute, particularly in tool-tip text shown to users upon hovering mouse pointers over images. In testing on the most recent version of Safari on iOS and OS X (9.1), I found that `alt` text will not be displayed in place of a broken image if the text runs longer than one line within the broken image’s dimensions as specified in HTML or CSS. Keeping `alt` text accessible means keeping it short, with *short* being an arbitrary descriptor even in modern browsers like Safari. Of course, the shorter `alt` text is, the less descriptive it can be.

Prior to HTML5, the `<img>` element had a long-description attribute (`longdesc`), which posed even more discoverability problems than `alt`, as not even an error condition revealed its presence. It was also frequently misused: HTML authors would stuff even more plain-text descriptive content into the `longdesc` attribute, instead of a URL pointing to the location of the descriptive content, as called for by the specification. For those reasons, `longdesc` is [obsolete in HTML5](http://www.w3.org/TR/html-markup/img.html), which now directs HTML authors simply to provide a link to any descriptive content via a vanilla anchor tag (`<a>`).

Despite their limitations, Yes, you should write `alt` attributes in your `<img>` tags. But No, you must not stop there, if your aim is an accessible presentation of images on the Web. The richest expressions of web accessibility are those that inclusively enrich the experience of a page or site for all users, regardless of ability.

When I write `alt` attributes, I always begin with a descriptor of the visual material being presented: *Photo of...*, *Map of...*, *Chart illustrating...* followed by the shortest possible description. Any content beyond that is more accessibly delivered to all users, using semantic elements that I’ll describe next.

## HTML Structure Around Images

Images must somehow be structurally presented alongside other HTML content, such as the running text of an article. It’s not uncommon to see markup that looks something like this:

    <div class="photo">
      <img src="hank.jpg" alt="Photo of Hank the dog." />
    </div>

That pattern provides a styling hook in CSS (`div.photo` or just `.photo`) for adding borders and other design elements to the image, and it also lends itself to including a caption of some sort, probably as a paragraph element:

    <div class="photo">
      <img src="hank.jpg" alt="Photo of Hank the dog." />
      <p>
        Hank enjoying himself in the flower garden on a hot day.
      </p>
    </div>

However, the accessibility of that markup is limited because `<div>` is a generic, non-semantic element. In the frank words of [the HTML5 specification](https://www.w3.org/TR/html5/grouping-content.html#the-div-element), “the `div` element has no special meaning at all” and therefore is “an element of last resort.” Adding `photo` in a `class` attribute will make sense to humans reading the source code, but it has no meaning to browsers or assistive devices. Neither is there any semantic indication that the paragraph inside of the `<div>` is a caption. The caption’s proximity in the source code is not enough to make its contents and purpose fully accessible to all.

HTML5 introduced a number of [new semantic elements as better alternatives](http://www.w3.org/TR/html5-diff/#new-elements) to generics like `<div>` and `<span>`. The new element for marking up images and other media is [`<figure>`](http://www.w3.org/TR/html/grouping-content.html#the-figure-element), which is “used to annotate illustrations, diagrams, photos, code listings, etc.” `<figure>` should also include its semantic child element called `<figcaption>` (figure caption). Here is the example above rewritten using the new semantic elements in HTML5:

    <figure class="photo">
      <img src="hank.jpg" alt="Photo of Hank the dog." />
      <figcaption>
        Hank enjoying himself in the flower garden on a hot day.
      </figcaption>
    </figure>

Unlike `<div>`, `<figure>` has a clear and well defined meaning in modern browsers and assistive devices. It’s semantic. The `<figcaption>` inside the `<figure>` element reflects a semantic association that informs browsers and assistive devices that the caption is specifically for the media presented inside of the `<figure>` element: the `<img>` tag, in this case. And unlike content tucked inside the `alt` attribute, the palpable content tagged by `<figcaption>` is presented to and therefore discoverable by all users.

## ARIA Attributes

[Accessible Rich Internet Applications (ARIA) attributes](http://www.w3.org/TR/wai-aria/states_and_properties) enhance HTML5’s native structural associations, such as those between `<figure>` and `<figcaption>`. ARIA attributes are specifically designed to reduce ambiguity of the function or purpose of a web page’s markup and interactive components. ARIA is in active development by the W3C’s [Web Accessibility Initiative](http://www.w3.org/WAI/), the umbrella organization responsible for the Web Content Accessibility Guidelines mentioned above, currently in [version 2.0](http://www.w3.org/TR/WCAG20/). There is also a specification in development for [ARIA in HTML](http://www.w3.org/TR/html-aria/), which when complete will clarify the use of ARIA alongside HTML’s native semantics. But there is no need to wait for that specification. ARIA can be used in HTML immediately.

The first ARIA attribute to enhance the example code I’ve written so far is [`aria-labelledby`](http://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby). Note the British English spelling of *labelled*, with two Ls. The value of that attribute must be a unique identifier assigned using the `id` attribute on some other HTML tag marking content that functions as a label for the image. In this example, the caption itself is an obvious label, so I’ve added `id="garden-photo-caption"` to `<figcaption>` and set `garden-photo-caption` as the value of `aria-labelledby` on the `<figure>` element:

    <figure class="photo" aria-labelledby="garden-photo-caption">
      <img src="hank.jpg" alt="Photo of Hank the dog." />
      <figcaption id="garden-photo-caption">
        Hank enjoying himself in the flower garden on a hot day.
      </figcaption>
    </figure>

That’s helped clarify the role of `<figcaption>` and its relationship to `<figure>`. But there’s another important ARIA attribute to include: `aria-describedby`. [The WAI-ARIA spec notes](http://www.w3.org/TR/wai-aria/states_and_properties#aria-describedby) that `aria-describedby` and `aria-labelledby` are similar “in that both reference other elements to calculate a text alternative, but a label should be concise, where a description is intended to provide more verbose information.”

It’s not hard to imagine that a full description of an image would naturally appear in the running text of the page where the image has been presented. The purpose of `aria-describedby` is to make a clear association between the `<figure>` element containing the image and the image’s description elsewhere. To make that associated, descriptive information discoverable to all users, including those with assistive technologies that do not yet to support `aria-describedby`, I’ve added to the end of the caption a simple *Full description* link that points to the descriptive content on the page, using [the `#`-style fragment identifier](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes#attr-id). (Note that that pattern is what is called for in replacing the old-school `longdesc` attribute’s function.) When activated, that link will scroll or otherwise point a user’s browser to the unique ID of the element containing the image’s full content. Capable assistive devices can leverage the identifier in `aria-describedby` to the same effect:

    <figure class="photo" aria-labelledby="garden-photo-caption" aria-describedby="garden-photo-description">
      <img src="hank.jpg" alt="Photo of Hank the dog." />
      <figcaption id="garden-photo-caption">
        Hank enjoying himself in the flower garden on a hot day. <a href="#garden-photo-description">Full description.</a>
      </figcaption>
    </figure>
    <!-- Elsewhere on the page: -->
    <p id="garden-photo-description">
      In the summertime, Hank loves to cool off in the garden’s damp dirt, which always ends up on
      his tongue... <!-- ...and so on -->
    </p>

This has become a very strong piece of markup compared to the initial bare-bones `<div>` example introduced above. And note that it is entirely HTML: no fancy JavaScript or anything is required to make all of this work. It’s an instructive example of the importance of careful treatment and ongoing study of HTML and its evolution beyond the humble, limited `alt` attribute.

## Foundational Styling for Older Browsers and Newer Semantics

ARIA-enhanced semantic HTML has made the page more accessible on a structural level, including for assistive technologies like screen readers. But because HTML is only a structural language, some CSS, the web’s design language, is required to make those semantic HTML features further accessible to sighted users.

First, not all browsers understand how to style newer elements like `<figure>`, so the page’s accompanying CSS must include this:

    /* CSS */
    figure,figcaption,img { display: block; }

That ensures that `figure` and `figcaption` display as blocks, separated vertically from other content. Because `img` defaults to displaying inline with other content, similar to bold or italic text, it also gets added to the list of elements to display as blocks. (If you need foundational selectors for other HTML5 elements, it’s worthwhile to crib from the HTML5 display definitions portion of [Normalize.css](https://github.com/necolas/normalize.css).)

Unfortunately, unlike past versions of all other browsers, older versions of Internet Explorer will not apply CSS to new HTML elements without the assistance of JavaScript. It’s possible to [create the new HTML elements](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) for Internet Explorer using JavaScript’s `document.createElement` method (e.g., `document.createElement('figure')`). However, [HTML5 Shiv](https://github.com/aFarkas/html5shiv) is a more fully-featured solution for anyone needing to support Internet Explorer versions 9 and earlier. You can include a copy of HTML5 Shiv in your site’s files or load the copy hosted by [cdnjs](https://cdnjs.com/libraries/html5shiv/), as in this example:

    <head>
      <!--
        Other <head> markup omitted for brevity; <script> tag
        is wrapped in conditional comments that only IE 9 and
        earlier will proceed to process; consult
        http://www.quirksmode.org/css/condcom.html
      -->
      <!--[if lt IE 9]>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.min.js"></script>
      <![endif]-->
    </head>

I’ve added the following CSS to highlight the descriptive content on the page, using the [`:target` pseudoclass](https://developer.mozilla.org/en-US/docs/Web/CSS/:target) that will be applied when someone activates the *Full description* link that points to `#content`. This little enhancement will be especially useful in cases where a layout would not require scrolling, and therefore leave a user puzzled by the presence of an apparently non-functional link in the figure caption:

    /* CSS */
    #"garden-photo-description:target {
      background: #DDD;
      transition: background 1s;
    }

The CSS `transition` property provides a subtle, one-second animation to fade in the background color, potentially giving users time to notice the change on the page as it happens.
