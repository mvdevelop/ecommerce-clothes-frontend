import styles from './Hero.module.css';
import hand_icon from '../assets/hand_icon.png';
import arrow_icon from '../assets/arrow.png';
import hero_image from '../assets/hero_image.png';

function Hero() {
  return (
    <>
      <div className={styles.hero_container}>
        <div className={styles.hero_left}>
          <h2>New Arrivals Only</h2>
          <div>
            <div className={styles.hero_hand_icon}>
              <p>new</p>
              <img src={hand_icon} alt="" />
            </div>
            <p>collection</p>
            <p>for everyone</p>
          </div>
          <div className={styles.hero_latest_btn}>
            <div>Latest Collection</div>
            <img src={arrow_icon} alt="" />
          </div>
        </div>
        <div className={styles.hero_right}>
          <img src={hero_image} alt="" />
        </div>
      </div>
    </>
  );
}

export default Hero;
