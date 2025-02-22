interface PromptData {
  language: "en" | "fa";
  length: number;
  category: string;
  keywords: string[];
}

export const promptLanguage = (data: PromptData | null): string | null => {
  if (!data) {
    return null;
  }

  const { language, length, category, keywords } = data;

  if (!length || !category || !Array.isArray(keywords) || keywords.length === 0) {
    throw new Error("Invalid input: length, category, and keywords are required.");
  }

  const keywordsList = keywords.join(", ");

  const prompts = {
    en: `Write a well-structured ${length}-word article about **${category}** in a clear and professional format.
      
      The article should include the following sections:

      **Title:** Provide a compelling and relevant title.

      **Introduction:**
      - Write a concise introduction explaining the topic and its significance.

      **Main Body:**
      - Present key aspects of the topic in a well-organized manner.
      - Use paragraphs for logical structuring.
      - Provide relevant examples or arguments if necessary.

      **Conclusion:**
      - Summarize key points.
      - End with a strong closing statement.

      Ensure the article includes these keywords: ${keywordsList}.
      The content should be professional, readable, and engaging.`,

    fa: `یک مقاله‌ی ساختاریافته و ${length} کلمه‌ای درباره **${category}** به‌صورت واضح و حرفه‌ای بنویس.
      
      مقاله باید شامل بخش‌های زیر باشد:

      **عنوان:**  
      - یک عنوان جذاب و مرتبط ارائه بده.

      **مقدمه:**  
      - مقدمه‌ای کوتاه درباره‌ی موضوع و اهمیت آن بنویس.

      **بدنه‌ی اصلی:**  
      - نکات کلیدی را به‌صورت منظم بیان کن.
      - از پاراگراف‌های منطقی استفاده کن.
      - در صورت نیاز، مثال یا استدلال ارائه بده.

      **نتیجه‌گیری:**  
      - نکات مهم را خلاصه کن.
      - مقاله را با یک جمله‌ی قوی پایان بده.

      اطمینان حاصل کن که مقاله شامل این کلمات کلیدی باشد: ${keywordsList}.
      محتوا باید حرفه‌ای، خوانا و جذاب باشد.`,
  };

  return prompts[language] || null;
};
