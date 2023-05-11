import React, { useState, useEffect } from "react";
import * as Tone from "tone";

const GithubMelody = ({ user }) => {
  const [commits, setCommits] = useState([]);

  // Fetch commit history for a GitHub user using the GitHub API

  // Retrieve activity data from GitHub API

  // Fetch the user's activity data from GitHub API
  async function getAllEvents(username) {
    let allEvents = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const response = await fetch(
        `https://api.github.com/users/${username}/events?page=${page}`
      );
      const data = await response.json();
      allEvents = allEvents.concat(data);
      const linkHeader = response.headers.get("Link");
      if (linkHeader) {
        const links = linkHeader.split(", ");
        const lastLink = links.find((link) => link.includes('rel="last"'));
        if (lastLink) {
          const match = /page=(\d+)/.exec(lastLink);
          totalPages = parseInt(match[1]);
        }
      }
      page++;
    }

    // sort events by date
    allEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // combine events into an array
    const startTime = new Date(allEvents[allEvents.length - 1].created_at);
    const endTime = new Date(allEvents[0].created_at);
    const days = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));
    const activity = Array(days).fill(0);
    allEvents.forEach((event) => {
      const date = new Date(event.created_at);
      const index = Math.floor((date - startTime) / (1000 * 60 * 60 * 24));
      activity[index]++;
    });

    return activity;
  }
  getAllEvents("ianjojo").then((activity) => {
    console.log(activity);
  });

  // Convert commit history to a melody
  useEffect(() => {
    const synth = new Tone.Synth().toDestination();
    const melody = commits.map((count) => {
      return (count % 12) + 48; // Map count to MIDI note number in range 48-59 (C3-B3)
    });

    // Add a delay between each note to prevent overlap
    let time = 0;
    melody.forEach((note) => {
      synth.triggerAttackRelease(Tone.Frequency(note, "midi"), "16n", time);
      time += 0.5;
    });
  }, [commits]);

  return (
    <div>
      <p>Playing melody based on commit history</p>
    </div>
  );
};

export default GithubMelody;
