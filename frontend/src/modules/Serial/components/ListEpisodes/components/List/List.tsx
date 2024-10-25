import EpisodeListButton from "../../ui/EpisodeListButton";
import styles from "./styles.module.scss";

const LISTEPISODES = [
  { active: true, disabled: false },
  { active: false, disabled: false },
  { active: false, disabled: false },
  { active: false, disabled: false },
  { active: false, disabled: false },
  { active: false, disabled: false },
  { active: false, disabled: false },
  { active: false, disabled: true },
  { active: false, disabled: true },
  { active: false, disabled: true },
  { active: false, disabled: true },
  { active: false, disabled: true },
  { active: false, disabled: true },
  { active: false, disabled: true },
  { active: false, disabled: true },
];

const ListEpisodeToggle = () => {
  return (
    <div className={styles.list}>
      {LISTEPISODES.map((el, index) => {
        return (
          <EpisodeListButton
            isActive={el.active}
            disabled={el.disabled}
            key={index}
          >
            {index + 1}
          </EpisodeListButton>
        );
      })}
    </div>
  );
};

export default ListEpisodeToggle;
