import React, { useState, useEffect } from "react";
import "./MeetTheTeam.css"; // Import CSS for this component

const teamMembers = [
  {
    name: "Hazel Yu",
    title: "Project Manager & UX Designer",
    photo: require("./assets/IMG_2183.jpeg"),
    bio: "Hi I’m Hazel, I am a Computer Science Major at RPI with a minor in Economics and Psychology. This is my first semester with the Rensselaer Center for Open Source. During my free time I like to shop, read books, watch netflix, and go on TikTok. I love thrifting anywhere I am so if you have any recommendations please let me know!"
  },
  {
    name: "Tyler Du",
    title: "DevOps Engineer & Network Engineer",
    photo: require("./assets/IMG_8934.jpeg"),
    bio: "Hi, this is Tyler! I am an undergraduate studying Computer Science graduating in Spring 2025. I am from the Biggest Little City in the World, Reno, Nevada[https://www.reno.gov/]. This is my third semester with RCOS! I spend lots of my free time playing a trading card game called Cardfight Vanguard[https://en.cf-vanguard.com/]."
  },
  {
    name: "Ritika Brahmadesam",
    title: "DevOps Engineer & Network Engineer",
    photo: require("./assets/IMG_7842_copy_2.jpg"),
    bio: "Hi I’m Ritika, I am a Mathematics and Computer Science Major at RPI with a minor in Economics. This is my third semester with the Rensselaer Center for Open Source. During my free time I like to swim, play my violin, and read. I am currently reading The Way of Kings by Brandon Sanderson. I really enjoy getting a sweet treat, specifically anything with peanut butter or chocolate, or even better both!"
  },
  {
    name: "Arnav Mukherjee",
    title: "Data Engineer",
    photo: require("./assets/IMG_3173.jpeg"),
    bio: "Hi, this is Arnav, I am an undergraduate Games Simulation Arts and Sciences and Computer Science major. I am from Pleasanton, CA and this is my first semester with RCOS. I enjoy running, hiking, traveling, making art, and playing video games. My favorite video game is Mario Kart Wii (I grew up with it). "
  }
];

const MeetTheTeam = () => {
  const [activeMember, setActiveMember] = useState(null);

  useEffect(() => {
    // Add dark mode class to the body when component mounts
    document.body.classList.add("dark-mode");

    // Remove dark mode class when component unmounts
    return () => {
      document.body.classList.remove("dark-mode");
    };
  }, []);

  const handleMemberClick = (index) => {
    setActiveMember(index === activeMember ? null : index);
  };

  return (
    <section id="meet-the-team" className="meet-the-team">
      <div className="container">
        <h2 className="meet-the-team-title">Meet the Team</h2>
        <div className="team-members">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="team-member" 
              onClick={() => handleMemberClick(index)}
            >
              <img
                src={member.photo}
                alt={member.name}
                className="team-member-photo"
              />
              <h3>{member.name}</h3>
              <p className="team-member-title">{member.title}</p>
              {activeMember === index && (
                <div className="team-member-bio">
                  <p>{member.bio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
