import React from 'react';
import '../styles/Contact.css';
import linkedinSvg from '../assets/linkedin.svg';
import profilefSvg from '../assets/profilef.svg';
import profileSvg from '../assets/profile.svg';

const team = [
  {
    name: 'Siddhi Bhosale',
    role: 'Frontend Developer',
    img: profilefSvg,
    linkedin: 'https://www.linkedin.com/in/siddhi-bhosale-7a9667331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    instagram: 'https://www.instagram.com/siddhibhosale7306?igsh=eW43aGwwODA4dXYz',
    email: 'siddhib06@gmail.com',
  },
  {
    name: 'Akash Hedaoo',
    role: 'Frontend Developer',
    img: profileSvg,
    linkedin: 'https://www.linkedin.com/in/akash-hedaoo-4b7773331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    instagram: 'https://www.instagram.com/akash_hedaoo_?igsh=djJvNTR0bmFtZmw3',
    email: 'akashhedaoo26782@gmail.com',
  },
  {
    name: 'Pratimesh Pawar',
    role: 'Backend Developer',
    img: profileSvg,
    linkedin: 'https://www.linkedin.com/in/pratimesh-pawar-8b472a331?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
    instagram: 'https://www.instagram.com/pratim_342/?hl=en',
    email:'prathameshpawar2712@gmail.com'
  },
];

const Contact = () => {
  return (
    <div className="contact-page">
      <h1 className="contact-title">Meet Our Team</h1>
      <div className="team-cards">
        {team.map((member, idx) => (
          <div className="team-card fade-in" style={{ animationDelay: `${0.2 + idx * 0.2}s` }} key={member.name}>
            <img src={member.img} alt={member.name} className="team-photo" />
            <h2 className="team-name">{member.name}</h2>
            <p className="team-role">{member.role}</p>
            <p className="team-email">{member.email}</p>
            <div className="team-links">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="team-link linkedin" title="LinkedIn">
                <img src={linkedinSvg} alt="LinkedIn" width="24" height="24" />
              </a>
              <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="team-link instagram" title="Instagram">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Contact; 