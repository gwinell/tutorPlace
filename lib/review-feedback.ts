export async function clearFeedbackAfterSuccessfulReview(
  submit: () => Promise<boolean>,
  clear: () => void,
) {
  const succeeded = await submit();
  if (succeeded) clear();
  return succeeded;
}
