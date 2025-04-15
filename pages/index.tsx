
import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { StarIcon, MoonIcon, SunIcon, HeartIcon, BriefcaseIcon } from '@heroicons/react/24/solid';

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const Home = () => {
  const [selectedSign, setSelectedSign] = useState('Aries');
  const [darkMode, setDarkMode] = useState(false);
  const [daysToShow, setDaysToShow] = useState(3);
  const [catFact, setCatFact] = useState('');
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');

    // Load predictions
    generatePredictions();
  }, [selectedSign, daysToShow]);

  const generatePredictions = () => {
    const days = [];
    const currentDate = new Date();
    
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + i);
      
      // Generate consistent random values based on date and sign
      const seed = date.getTime() + selectedSign.length;
      const health = (seed % 10) + 1;
      const relationships = ((seed * 2) % 10) + 1;
      const career = ((seed * 3) % 10) + 1;

      days.push({
        date: date.toLocaleDateString(),
        health,
        relationships,
        career
      });
    }

    setPredictions(days);
    localStorage.setItem(`predictions-${selectedSign}`, JSON.stringify(days));

    // Fetch cat fact if average score is above 7
    const avgScore = days[0].health + days[0].relationships + days[0].career;
    if (avgScore / 3 > 7) {
      fetchCatFact();
    }
  };

  const fetchCatFact = async () => {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      const data = await response.json();
      setCatFact(data.fact);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}?sign=${selectedSign}&days=${daysToShow}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <Head>
        <title>Horoscope App</title>
        <meta name="description" content="Daily horoscope predictions" />
      </Head>

      <main className={styles.main}>
        <div className={styles.controls}>
          <button onClick={() => setDarkMode(!darkMode)} className={styles.themeToggle}>
            {darkMode ? <SunIcon width={24} /> : <MoonIcon width={24} />}
          </button>
          
          <select 
            value={selectedSign} 
            onChange={(e) => setSelectedSign(e.target.value)}
            className={styles.select}
          >
            {zodiacSigns.map(sign => (
              <option key={sign} value={sign}>{sign}</option>
            ))}
          </select>

          <div className={styles.daysToggle}>
            <button 
              className={daysToShow === 3 ? styles.active : ''} 
              onClick={() => setDaysToShow(3)}
            >
              3 Days
            </button>
            <button 
              className={daysToShow === 7 ? styles.active : ''} 
              onClick={() => setDaysToShow(7)}
            >
              7 Days
            </button>
          </div>
        </div>

        <div className={styles.zodiacImage}>
          <StarIcon width={100} />
        </div>

        <div className={styles.predictions}>
          {predictions.map((pred, idx) => (
            <div key={idx} className={styles.predictionCard}>
              <h3>{pred.date}</h3>
              <div className={styles.scores}>
                <div>
                  <HeartIcon width={24} />
                  <span>Health: {pred.health}</span>
                </div>
                <div>
                  <HeartIcon width={24} />
                  <span>Relationships: {pred.relationships}</span>
                </div>
                <div>
                  <BriefcaseIcon width={24} />
                  <span>Career: {pred.career}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {catFact && (
          <div className={styles.catFact}>
            <p>Lucky Cat Fact: {catFact}</p>
          </div>
        )}

        <button onClick={copyLink} className={styles.copyButton}>
          Copy Link
        </button>
      </main>
    </div>
  );
};

export default Home;
