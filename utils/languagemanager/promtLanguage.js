export const promptLanguage = (data) => {
  if (!data) {
    return null;
  }
  const { language, length, category, keywords } = data;

  if (!length || !category || !Array.isArray(keywords)) {
    throw new Error(
      "Invalid input: length, category, and keywords are required."
    );
  }

  let prompt;

  if (language === "en") {
    prompt = `Write a well-structured ${length}-word article about **${category}** in a clear and professional format.
      The article should include the following sections:
  
      **Title:** Provide a compelling and relevant title for the article.
  
      **Introduction:**
      - Write a concise introduction that briefly explains the topic and its significance.
  
      **Main Body:**
      - Present the key aspects of the topic in a well-organized manner.
      - Use paragraphs to structure the information logically.
      - Provide relevant examples or arguments if necessary.
  
      **Conclusion:**
      - Summarize the key points discussed in the article.
      - End with a strong and engaging closing statement.
  
      Ensure the article includes these keywords: ${keywords.join(", ")}.
      The content should be professional, readable, and engaging.`;
  } else {
    prompt = `یک مقاله‌ی ساختاریافته و ${length} کلمه‌ای درباره **${category}** به‌صورت واضح و حرفه‌ای بنویس.  
  مقاله باید شامل بخش‌های زیر باشد:
  
  **عنوان:**  
  - یک عنوان جذاب و مرتبط برای مقاله ارائه بده.
  
  **مقدمه:**  
  - یک مقدمه‌ی مختصر بنویس که موضوع را توضیح داده و اهمیت آن را بیان کند.
  
  **بدنه‌ی اصلی:**  
  - نکات کلیدی مربوط به موضوع را به‌صورت منظم ارائه بده.  
  - از پاراگراف‌های مناسب برای ساختاربندی منطقی محتوا استفاده کن.  
  - در صورت نیاز، مثال‌ها یا استدلال‌های مرتبط بیاور.
  
  **نتیجه‌گیری:**  
  - نکات کلیدی مقاله را خلاصه کن.  
  - با یک جمله‌ی قوی و تأثیرگذار مقاله را به پایان برسان.
  
  اطمینان حاصل کن که مقاله شامل این کلمات کلیدی باشد: ${keywords.join(", ")}.  
  محتوا باید حرفه‌ای، خوانا و جذاب باشد.`;
  }

  return prompt;
};
