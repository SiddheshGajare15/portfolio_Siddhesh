/**
 * Shuffle utility — Fisher-Yates algorithm.
 * Returns a NEW shuffled array; does not mutate the original.
 *
 * NOTE: All question data lives in Supabase (mock_tests.questions).
 *       This file intentionally contains NO question content.
 */
export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
