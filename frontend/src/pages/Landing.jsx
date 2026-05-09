import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

export default function Landing() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let animationFrameId;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    const animRing = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      animationFrameId = requestAnimationFrame(animRing);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animRing();

    // Hover effects
    const hoverElements = document.querySelectorAll('.saylo-landing a, .saylo-landing button, .saylo-landing .rpill, .saylo-landing .feat, .saylo-landing .plan');
    const handleMouseEnter = () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      ring.style.width = '52px';
      ring.style.height = '52px';
    };
    const handleMouseLeave = () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      ring.style.width = '36px';
      ring.style.height = '36px';
    };

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    // Intersection Observer
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    const reveals = document.querySelectorAll('.saylo-landing [data-reveal]');
    reveals.forEach(el => obs.observe(el));

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      hoverElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      reveals.forEach(el => obs.unobserve(el));
    };
  }, []);

  return (
    <div className="saylo-landing" id="saylo-landing">
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>

      {/* NAV */}
      <nav>
        <Link to="/" className="logo">SAYLO</Link>
        <ul className="nav-links">
          <li><a href="#features">Product</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#roles">Roles</a></li>
          <li><Link to="/login" style={{ opacity: 1 }}>Sign In</Link></li>
          <li><Link to="/signup" className="nav-cta">Start Free</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div>
            <div className="hero-eyebrow">
              <span className="eyebrow-dot"></span>
              AI Interview Coach — Now Live
            </div>
            <h1>TALK<br/>YOUR<br/><em>WAY</em><br/>IN.</h1>
            <p className="hero-sub">Saylo is your AI-powered interview coach. Practice with an interviewer that adapts, pushes back, and makes you genuinely better — one conversation at a time.</p>
            <div className="hero-btns">
              <Link to="/signup" className="btn-main">Start Practicing <span className="arrow-icon">↗</span></Link>
              <a href="#features" className="btn-ghost">See how it works →</a>
            </div>
          </div>
          <div className="hero-meta" data-reveal>
            <div className="meta-item">
              <div className="meta-num">50K+</div>
              <div className="meta-label">Candidates trained</div>
            </div>
            <div className="meta-item">
              <div className="meta-num">94%</div>
              <div className="meta-label">Success rate</div>
            </div>
            <div className="meta-item">
              <div className="meta-num">40+</div>
              <div className="meta-label">Career roles</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="screen-label">Live Session · Software Engineer · Google</div>
          <div className="interview-window">
            <div className="win-header">
              <div className="win-dots">
                <div className="wd wd1"></div>
                <div className="wd wd2"></div>
                <div className="wd wd3"></div>
              </div>
              <span className="win-title">saylo.ai — mock interview</span>
              <div className="ai-status">
                <div className="ai-pulse"></div>
                Interviewing...
              </div>
            </div>
            <div className="chat-area">
              <div className="msg ai">
                <span className="msg-who">Saylo AI</span>
                <div className="msg-bubble">Walk me through how you'd design a URL shortener like bit.ly that handles 100 million requests per day. Start with your assumptions.</div>
              </div>
              <div className="msg user">
                <span className="msg-who">You</span>
                <div className="msg-bubble">Sure. First assumption — reads heavily outnumber writes, maybe 100:1. I'd use a NoSQL store like Cassandra for the redirect mappings, a consistent hashing layer, and cache hot URLs in Redis with a 24hr TTL...</div>
              </div>
              <div className="msg ai">
                <span className="msg-who">Saylo AI</span>
                <div className="msg-bubble">Good instincts. But how does your system handle hash collisions, and what's your fallback if Redis goes down mid-request?</div>
              </div>
            </div>
            <div className="feedback-strip">
              <div className="fb-title">Live Analysis</div>
              <div className="fb-bars">
                <div className="fb-row">
                  <span className="fb-key">Clarity</span>
                  <div className="fb-track"><div className="fb-fill" style={{ width: '87%' }}></div></div>
                  <span className="fb-pct">87%</span>
                </div>
                <div className="fb-row">
                  <span className="fb-key">Depth</span>
                  <div className="fb-track"><div className="fb-fill" style={{ width: '72%' }}></div></div>
                  <span className="fb-pct">72%</span>
                </div>
                <div className="fb-row">
                  <span className="fb-key">Confidence</span>
                  <div className="fb-track"><div className="fb-fill" style={{ width: '91%' }}></div></div>
                  <span className="fb-pct">91%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          <span className="ticker-item">Real-time Feedback <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">System Design <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Behavioural Rounds <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Case Studies <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">DSA Practice <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Salary Negotiation <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">STAR Framework <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">40+ Roles <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Real-time Feedback <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">System Design <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Behavioural Rounds <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Case Studies <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">DSA Practice <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">Salary Negotiation <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">STAR Framework <span className="ticker-sep">✦</span></span>
          <span className="ticker-item">40+ Roles <span className="ticker-sep">✦</span></span>
        </div>
      </div>

      {/* ABOUT */}
      <section className="about">
        <div className="about-left" data-reveal>
          <div className="section-num">01 — What is Saylo</div>
          <h2>NOT A<br/>QUIZ.<br/>AN ACTUAL<br/><em>Interview.</em></h2>
        </div>
        <div className="about-right" data-reveal>
          <p className="about-desc">Most platforms give you flashcards. Saylo gives you an interviewer that thinks, reacts, and challenges you the way real hiring managers do — because rehearsing the uncomfortable parts is what actually prepares you.</p>
          <ul className="about-list">
            <li><span className="list-num">01</span>Choose your role, company, and difficulty</li>
            <li><span className="list-num">02</span>Answer like it's the real thing — voice or text</li>
            <li><span className="list-num">03</span>Get scored on clarity, depth, and structure</li>
            <li><span className="list-num">04</span>Repeat until you stop second-guessing yourself</li>
          </ul>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-header" data-reveal>
          <h2>02 — Built Different</h2>
          <p>Every feature exists because a real candidate asked for it. No fluff, no filler — just tools that make you sharper.</p>
        </div>
        <div className="features-grid">
          <div className="feat" data-reveal>
            <div className="feat-n">01</div>
            <h3>Adaptive AI Interviewer</h3>
            <p>Asks follow-ups based on your actual answers. Doesn't let vague responses slide. Mirrors the pressure of a real interview loop.</p>
          </div>
          <div className="feat" data-reveal>
            <div className="feat-n">02</div>
            <h3>Real-time Scoring</h3>
            <p>Clarity, depth, confidence, and structure — scored live as you speak. Know exactly what to fix before your actual interview.</p>
          </div>
          <div className="feat" data-reveal>
            <div className="feat-n">03</div>
            <h3>Company-specific Banks</h3>
            <p>Questions curated from real interview reports at Google, Amazon, McKinsey, Goldman Sachs, and 200+ other companies.</p>
          </div>
          <div className="feat" data-reveal>
            <div className="feat-n">04</div>
            <h3>STAR Coach</h3>
            <p>Behavioral questions are the ones people fumble most. Saylo rebuilds your storytelling from the ground up, answer by answer.</p>
          </div>
          <div className="feat" data-reveal>
            <div className="feat-n">05</div>
            <h3>Progress Intelligence</h3>
            <p>See your improvement curve over time. Identify your blind spots. Know when you're actually ready — not just feel ready.</p>
          </div>
          <div className="feat" data-reveal>
            <div className="feat-n">06</div>
            <h3>Resume-anchored Questions</h3>
            <p>Upload your resume and Saylo generates questions specifically about your experience — just like a real interviewer would.</p>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="roles-section" id="roles" data-reveal>
        <div className="roles-heading">
          <div className="section-num">03 — Roles</div>
          <h2>EVERY<br/>TRACK.</h2>
          <p>From Big Tech to consulting to startups — we have the questions.</p>
        </div>
        <div className="roles-pills">
          <div className="rpill hot">Software Engineer</div>
          <div className="rpill hot">Product Manager</div>
          <div className="rpill">Data Scientist</div>
          <div className="rpill">ML Engineer</div>
          <div className="rpill">UX Designer</div>
          <div className="rpill hot">Consultant</div>
          <div className="rpill">Finance Analyst</div>
          <div className="rpill">Business Analyst</div>
          <div className="rpill">Marketing Lead</div>
          <div className="rpill">DevOps Engineer</div>
          <div className="rpill">Sales Manager</div>
          <div className="rpill">Operations Lead</div>
          <div className="rpill">HR Manager</div>
          <div className="rpill">Content Strategist</div>
          <div className="rpill">Project Manager</div>
          <div className="rpill">Legal Counsel</div>
          <div className="rpill">Growth Manager</div>
          <div className="rpill">Data Engineer</div>
          <div className="rpill">Investment Banking</div>
          <div className="rpill">+ 20 more</div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="testi-header" data-reveal>
          <div className="section-num">04 — Results</div>
          <h2>REAL PEOPLE,<br/>REAL OFFERS.</h2>
        </div>
        <div className="testi-grid">
          <div className="testi" data-reveal>
            <div className="testi-company">Google · L5 Software Engineer</div>
            <p className="testi-quote">"I failed Google once. Six months later I used Saylo for two weeks and the difference in how I thought through problems was night and day. Got the offer."</p>
            <div className="testi-person">
              <div className="testi-av av-a">RS</div>
              <div>
                <div className="testi-name">Rahul S.</div>
                <div className="testi-role">Hyderabad → Google London</div>
              </div>
            </div>
          </div>
          <div className="testi" data-reveal>
            <div className="testi-company">Airbnb · Senior PM</div>
            <p className="testi-quote">"The AI pushed back on my answers in a way no practice guide ever did. That's what made the actual interview feel easy — I'd already had harder conversations with Saylo."</p>
            <div className="testi-person">
              <div className="testi-av av-b">PK</div>
              <div>
                <div className="testi-name">Priya K.</div>
                <div className="testi-role">Bangalore → Airbnb SF</div>
              </div>
            </div>
          </div>
          <div className="testi" data-reveal>
            <div className="testi-company">McKinsey · Associate</div>
            <p className="testi-quote">"Case prep on Saylo is structured in a way that actually replicates McKinsey's style. I walked in knowing exactly what to expect. Three rounds, one offer."</p>
            <div className="testi-person">
              <div className="testi-av av-c">AM</div>
              <div>
                <div className="testi-name">Ananya M.</div>
                <div className="testi-role">IIM-A → McKinsey Delhi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="pricing-header" data-reveal>
          <div className="section-num">05 — Pricing</div>
          <h2>HONEST<br/><em>Pricing.</em></h2>
        </div>
        <div className="plans">
          <div className="plan" data-reveal>
            <div className="plan-name">Free</div>
            <div className="plan-desc">Good enough to decide if Saylo is worth your time. (It is.)</div>
            <div className="plan-price">
              <span className="plan-price-num">₹0</span>
              <span className="plan-price-period">forever</span>
            </div>
            <ul className="plan-features">
              <li>5 mock interviews / month</li>
              <li>Basic feedback report</li>
              <li>3 role tracks</li>
              <li>Community access</li>
            </ul>
            <a href="#" className="plan-btn">Get Started</a>
          </div>
          <div className="plan featured" data-reveal>
            <div className="featured-tag">✦ Most Popular</div>
            <div className="plan-name">Pro</div>
            <div className="plan-desc">For candidates who are serious about landing the offer.</div>
            <div className="plan-price">
              <span className="plan-price-num">₹999</span>
              <span className="plan-price-period">/ month</span>
            </div>
            <ul className="plan-features">
              <li>Unlimited mock interviews</li>
              <li>Deep AI scoring + feedback</li>
              <li>All 40+ role tracks</li>
              <li>Company-specific banks</li>
              <li>Resume-anchored questions</li>
              <li>Progress dashboard</li>
            </ul>
            <a href="#" className="plan-btn">Start Pro Trial</a>
          </div>
          <div className="plan" data-reveal>
            <div className="plan-name">Teams</div>
            <div className="plan-desc">For colleges, bootcamps, and hiring teams training at scale.</div>
            <div className="plan-price">
              <span className="plan-price-num">₹3,999</span>
              <span className="plan-price-period">/ month</span>
            </div>
            <ul className="plan-features">
              <li>Up to 20 users</li>
              <li>Admin dashboard</li>
              <li>Custom question banks</li>
              <li>Cohort analytics</li>
              <li>Dedicated support</li>
              <li>Bulk session scheduling</li>
            </ul>
            <a href="#" className="plan-btn">Contact Sales</a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="cta">
        <div className="cta-left" data-reveal>
          <h2>READY<br/>TO <span>WIN</span><br/>YOUR<br/>NEXT ONE?</h2>
          <div className="cta-btns">
            <a href="#" className="cta-btn-main">Start Free Today</a>
            <a href="#features" className="cta-btn-ghost">See the Product →</a>
          </div>
        </div>
        <div className="cta-right" data-reveal>
          <div className="section-num">Why it works</div>
          <div>
            <div className="cta-stat-big">94%</div>
            <p className="cta-stat-label">of Saylo users who practice 3+ sessions per week land their target role within 60 days. Preparation isn't a shortcut — it's the whole point.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">SAYLO</div>
        <ul className="footer-links">
          <li><a href="#">Product</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
        </ul>
        <div className="footer-copy">© 2026 Saylo Technologies</div>
      </footer>
    </div>
  );
}
