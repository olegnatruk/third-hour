"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDownRight,
  ArrowUpRight,
  Facebook,
  MapPin,
  Menu,
  X,
} from "lucide-react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const facebookUrl = "https://www.facebook.com/profile.php?id=61577136480938";
const foodpandaUrl = "https://www.foodpanda.ph/restaurant/rhkq/third-hour-cafe-san-pablo";
const directionsUrl =
  "https://www.google.com/maps/search/?api=1&query=Third%20Hour%20Cafe%2C%2018%20Apolinario%20Mabini%20St%2C%20San%20Pablo%20City%2C%20Laguna";

const gallery = [
  { src: "/images/third-hour/coffee-bloom.jpg", alt: "Third Hour coffee with flowers", className: "gallery-tall" },
  { src: "/images/third-hour/coffee-dessert-01.jpg", alt: "Third Hour coffee and dessert", className: "gallery-wide" },
  { src: "/images/third-hour/drink-dessert.jpg", alt: "Third Hour drink and dessert", className: "gallery-square" },
  { src: "/images/third-hour/coffee-sandwich.jpg", alt: "Third Hour coffee and sandwich", className: "gallery-square" },
  { src: "/images/third-hour/coffee-dessert-02.jpg", alt: "Third Hour coffee and pastry", className: "gallery-wide" },
  { src: "/images/third-hour/club-sandwich.jpg", alt: "Third Hour club sandwich", className: "gallery-tall" },
];

const menu = [
  ["Third Hour Coffee", "House-crafted signature coffee"],
  ["Spanish Latte", "Smooth, sweet, and familiar"],
  ["Midnight Sea Salt Latte", "A creamy-salty favourite"],
  ["Matcha Oat Latte", "Earthy, creamy, and light"],
];

export function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
        intro
          .from(".nav-wordmark", { yPercent: 120, autoAlpha: 0, duration: 0.85 })
          .from(".hero-copy > *", { y: 38, autoAlpha: 0, duration: 0.85, stagger: 0.11 }, "<0.14")
          .from(".hero-mosaic", { clipPath: "inset(0 0 100% 0)", duration: 1.2 }, "<0.1")
          .from(".hero-image", { scale: 1.16, duration: 1.25, stagger: 0.08 }, "<");

        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { y: 34, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.86,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        gsap.to(".hero-orbit", {
          rotation: 22,
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(".loyalty-stamps", {
          rotate: 5,
          y: -12,
          ease: "none",
          scrollTrigger: {
            trigger: ".loyalty-section",
            start: "top 90%",
            end: "bottom 30%",
            scrub: 0.6,
          },
        });
      });

      return () => media.revert();
    },
    { scope: root },
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" ref={root}>
      <header className="site-header">
        <a className="wordmark nav-wordmark" href="#top" aria-label="Third Hour home" onClick={closeMenu}>
          third hour
        </a>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation">
          <a href="#menu" onClick={closeMenu}>Menu</a>
          <a href="#story" onClick={closeMenu}>Our story</a>
          <a href="#visit" onClick={closeMenu}>Visit us</a>
          <a className="nav-loyalty" href="#loyalty" onClick={closeMenu}>Join loyalty</a>
        </nav>
        <button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-intro">The best hour of your day.</p>
            <h1 id="hero-title">Make room<br />for the third<br /><em>hour.</em></h1>
            <p className="hero-description">Coffee, comfort, and the kind of conversations that make an ordinary day feel like yours.</p>
            <div className="hero-actions">
              <a className="button button-gold" href="#menu">See what&apos;s brewing <ArrowDownRight aria-hidden="true" /></a>
              <a className="text-link" href={facebookUrl} target="_blank" rel="noreferrer">Find us on Facebook <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>
          <div className="hero-mosaic" aria-label="A selection of Third Hour Cafe drinks and food">
            <figure className="mosaic-image mosaic-image-main">
              <Image className="hero-image" src="/images/third-hour/coffee-cup.jpg" alt="A coffee from Third Hour Cafe" fill priority sizes="(max-width: 760px) 80vw, 30vw" />
            </figure>
            <figure className="mosaic-image mosaic-image-side">
              <Image className="hero-image" src="/images/third-hour/coffee-bloom-02.jpg" alt="Third Hour Cafe drink" fill sizes="(max-width: 760px) 34vw, 16vw" />
            </figure>
            <figure className="mosaic-image mosaic-image-bottom">
              <Image className="hero-image" src="/images/third-hour/dessert-drink.jpg" alt="Third Hour Cafe dessert and drink" fill sizes="(max-width: 760px) 42vw, 18vw" />
            </figure>
            <p className="mosaic-caption">Coffee worth lingering over.</p>
          </div>
        </section>

        <section className="pause-section section-grid" id="story">
          <div className="pause-copy" data-reveal>
            <h2>The pause is<br />the point.</h2>
            <p>Third Hour is made for lingering: a coffee between meetings, a table for catching up, a quiet corner when the day needs to slow down.</p>
          </div>
          <div className="pause-note" data-reveal>
            <p>Come early.<br /><em>Stay after.</em></p>
            <span>A table is waiting.</span>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="section-heading" data-reveal>
            <p>Made for every kind of craving.</p>
            <h2>A little something<br />for every hour.</h2>
          </div>
          <div className="menu-layout">
            <ol className="menu-list" data-reveal>
              {menu.map(([name, description], index) => (
                <li key={name}>
                  <span className="menu-index">0{index + 1}</span>
                  <div><h3>{name}</h3><p>{description}</p></div>
                  <span className="menu-rule" aria-hidden="true" />
                </li>
              ))}
            </ol>
            <div className="menu-spotlight" data-reveal>
              <Image src="/images/third-hour/coffee-dessert-04.jpg" alt="Third Hour coffee and dessert" fill sizes="(max-width: 760px) 100vw, 42vw" />
              <a href={foodpandaUrl} target="_blank" rel="noreferrer" className="spotlight-link">Order a favourite <ArrowUpRight aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="gallery-section" aria-label="Third Hour menu gallery">
          <div className="gallery-intro" data-reveal>
            <p>From iced signatures to comfort food, your good hour has a little room to grow.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map((image) => (
              <figure className={`gallery-item ${image.className}`} data-reveal key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 48vw, 25vw" />
              </figure>
            ))}
          </div>
        </section>

        <section className="loyalty-section" id="loyalty">
          <div className="loyalty-card loyalty-stamps" data-reveal>
            <div className="loyalty-card-top">
              <span className="wordmark">third hour</span>
              <span>DIGITAL COFFEE CARD</span>
            </div>
            <div className="stamp-grid" aria-label="Seven out of ten stamps collected">
              {Array.from({ length: 10 }, (_, index) => <span className={index < 7 ? "stamp is-filled" : "stamp"} key={index} />)}
            </div>
            <div className="loyalty-card-bottom"><span>7 / 10 stamps</span><span>A little thank-you after ten good coffees.</span></div>
          </div>
          <div className="loyalty-copy" data-reveal>
            <p>For the regulars.</p>
            <h2>Your coffee<br />comes back<br />to <em>you.</em></h2>
            <p>Keep every good cup close. Collect one stamp at a time, then save completed cards as little markers of your Third Hour story.</p>
            <a className="button button-cream" href="#visit">Explore loyalty <ArrowDownRight aria-hidden="true" /></a>
          </div>
        </section>

        <section className="visit-section section-grid" id="visit">
          <div className="visit-copy" data-reveal>
            <p>Come as you are.</p>
            <h2>Find your next<br /><em>good hour.</em></h2>
            <p>Bring a book, a friend, or a little space in your day.</p>
            <a className="text-link" href={directionsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight aria-hidden="true" /></a>
          </div>
          <aside className="address-panel" data-reveal>
            <MapPin aria-hidden="true" />
            <h3>Third Hour Cafe</h3>
            <p>18 Apolinario Mabini St<br />San Pablo City, Laguna</p>
            <span>Along JSmile, across Central</span>
            <div className="address-line" />
            <p className="delivery-note">Available on Foodpanda, Grab &amp; SPURS.</p>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <div><a className="wordmark" href="#top">third hour</a><p>Make room for the good part of the day.</p></div>
        <nav aria-label="Footer navigation"><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#loyalty">Loyalty card</a></nav>
        <a className="footer-facebook" href={facebookUrl} target="_blank" rel="noreferrer"><Facebook aria-hidden="true" /> Facebook <ArrowUpRight aria-hidden="true" /></a>
      </footer>
    </div>
  );
}
