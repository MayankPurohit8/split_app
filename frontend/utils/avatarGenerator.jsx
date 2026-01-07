export const avatarGenerator = () => {
  const randomString = (length = 8) =>
    Math.random()
      .toString(36)
      .substring(2, 2 + length);
  const seed = randomString();
  const style = Math.floor(Math.random() * 7);
  const styles = [
    "avataaars",
    "adventurer-neutral",
    "notionists",
    "personas",
    "miniavs",
    "bottts-neutral",
    "pixel-art-neutral",
  ];
  const url = `https://api.dicebear.com/9.x/${styles[style]}/svg?seed=${seed}`;
  return url;
};
