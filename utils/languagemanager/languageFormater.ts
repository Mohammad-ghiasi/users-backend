interface FormattedContent {
  title: string;
  introduction: string;
  main_body: string;
  conclusion: string;
}

export const formatResponse = (
  content: string | null,
  language: "en" | "fa"
): FormattedContent | null => {
  if (!content) return null;

  const regexPatterns = {
    en: {
      title: /(?<=\*\*Title:\*\*\s)(.*)/,
      introduction: /(?<=\*\*Introduction:\*\*\s)([\s\S]*?)(?=\*\*Main Body:\*\*)/,
      main_body: /(?<=\*\*Main Body:\*\*\s)([\s\S]*?)(?=\*\*Conclusion:\*\*)/,
      conclusion: /(?<=\*\*Conclusion:\*\*\s)([\s\S]*)/,
    },
    fa: {
      title: /(?<=\*\*(?:Title|عنوان):\*\*\s)(.*)/,
      introduction: /(?<=\*\*(?:Introduction|مقدمه):\*\*\s)([\s\S]*?)(?=\*\*(?:Main Body|بدنه‌ی اصلی):\*\*)/,
      main_body: /(?<=\*\*(?:Main Body|بدنه‌ی اصلی):\*\*\s)([\s\S]*?)(?=\*\*(?:Conclusion|نتیجه‌گیری):\*\*)/,
      conclusion: /(?<=\*\*(?:Conclusion|نتیجه‌گیری):\*\*\s)([\s\S]*)/,
    },
  };

  const patterns = regexPatterns[language];

  return {
    title: content.match(patterns.title)?.[0] || "",
    introduction: content.match(patterns.introduction)?.[0] || "",
    main_body: content.match(patterns.main_body)?.[0] || "",
    conclusion: content.match(patterns.conclusion)?.[0] || "",
  };
};
