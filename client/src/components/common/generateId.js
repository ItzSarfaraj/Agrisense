const generateId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return generateId();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}`;
};

export default generateId;