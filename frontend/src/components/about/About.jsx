import "./About.css";
import Hack from '../../assets/Hacker2.png';

const About = () => {
  return (
    <div className="about-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-text">
          <h1>
            About Our <span>Cybersecurity Club</span>
          </h1>
          <p>
            We are a collaborative cybersecurity club driven by curiosity,
            innovation, and hands-on learning. Our mission is to build strong
            cyber defenders.
          </p>
          <div className="hero-buttons">
            <a href="#" className="btn-primary">Join the Club</a>
            <a href="#" className="btn-outline">Explore Our Work</a>
          </div>
        </div>

        <div className="hero-visual">
          <img src={Hack} alt="Cybersecurity Visual" />
        </div>
      </section>

      <div className="glow-divider" />

      {/* ABOUT */}
    <section className="about">
    {/* LEFT CARD */}
<div className="about-card">

  <div className="about-card-content">
    {/* TEXT */}
    <div className="about-text">
      <h2>About Our Cybersecurity Club</h2>
      <p>
        We are a student-driven cybersecurity community on a mission to build the
        next generation of ethical hackers and defenders.
      </p>

      <div className="mission">
        <h3>Our Mission & Vision</h3>
        <p>
          To provide practical cybersecurity education with a strong ethical
          focus through workshops, competitions, and research.
        </p>
      </div>
    </div>

    {/* IMAGE */}
    <div className="card-image">
      {/* <img src={Lock} alt="Cybersecurity Shield" /> */}
    </div>
  </div>

</div>

    {/* RIGHT LIST */}
    <div className="about-list">
        <div className="list-item">
        <h4>Ethical Hacking & Penetration Testing</h4>
        <p>Hands-on offensive and defensive security training.</p>
        </div>

        <div className="list-item">
        <h4>Cyber Awareness & Training</h4>
        <p>Building strong security fundamentals and best practices.</p>
        </div>

        <div className="list-item">
        <h4>Capture The Flag (CTF) & Research</h4>
        <p>Competitive problem solving and real-world research exposure.</p>
        </div>

        <div className="list-item">
        <h4>Networking & Industry Connections</h4>
        <p>Collaborate with professionals and cybersecurity communities.</p>
        </div>
    </div>
    </section>


      <div className="glow-divider" />

      {/* WHAT WE DO */}
      <section>
        <h2 className="section-title">What We Do</h2>
        <div className="cards">
          {[
            ["Vulnerability Assessment", "Identifying and analyzing security weaknesses in systems."],
            ["Ethical Hacking Workshops", "Hands-on sessions with real-world hacking tools."],
            ["CTF & Hackathons", "Competitive events to sharpen cybersecurity skills."],
            ["Cyber Research Projects", "Exploring advanced topics in cybersecurity."],
            ["Network & Cloud Security", "Securing modern infrastructure and data."],
            ["Peer-to-Peer Learning", "Collaborative learning within the community."]
          ].map(([title, desc], i) => (
            <div className="card" key={i}>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-divider" />

      {/* STATS */}
      <section>
        <div className="stats">
          <div className="stat"><h2>50+</h2><p>Active Members</p></div>
          <div className="stat"><h2>30+</h2><p>Workshops & Events</p></div>
          <div className="stat"><h2>10+</h2><p>Industry Mentors</p></div>
          <div className="stat"><h2>1000+</h2><p>Hours of Practice</p></div>
        </div>
      </section>

      <div className="glow-divider" />

      {/* TEAM */}
      <section>
        <h2 className="section-title">Meet the Team Behind the Defense</h2>
        <div className="team">
          {[
            ["Alex Johnson", "Club Lead"],
            ["Sarah Lee", "Technical Head"],
            ["John Carter", "Research Lead"],
            ["Maria Gonzalez", "Event Coordinator"]
          ].map(([name, role], i) => (
            <div className="member" key={i}>
              <div className="avatar"></div>
              <h4>{name}</h4>
              <span>{role}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="glow-divider" />

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Defend the Digital Future?</h2>
        <p>Join our cybersecurity club and grow with hands-on experience.</p>
        <a href="#" className="btn-primary">Get Involved</a>
      </section>

    </div>
  );
};

export default About;
