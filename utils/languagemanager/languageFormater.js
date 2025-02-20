export const formatResponse = (content, language) => {
  if (!content) {
    return null;
  }
  let format;

  if (language === "en") {
    format ={
          title:
            content.match(
              /(?<=\*\*Title:\*\*\s)(.*)/
            )?.[0] || "",
          introduction:
            content.match(
              /(?<=\*\*Introduction:\*\*\s)([\s\S]*?)(?=\*\*Main Body:\*\*)/
            )?.[0] || "",
          main_body:
            content.match(
              /(?<=\*\*Main Body:\*\*\s)([\s\S]*?)(?=\*\*Conclusion:\*\*)/
            )?.[0] || "",
          conclusion:
            content.match(
              /(?<=\*\*Conclusion:\*\*\s)([\s\S]*)/
            )?.[0] || "",
        };
  } else {
    format = {
      title: content.match(/(?<=\*\*(?:Title|عنوان):\*\*\s)(.*)/)?.[0] || "",
      introduction:
        content.match(
          /(?<=\*\*(?:Introduction|مقدمه):\*\*\s)([\s\S]*?)(?=\*\*(?:Main Body|بدنه‌ی اصلی):\*\*)/
        )?.[0] || "",
      main_body:
        content.match(
          /(?<=\*\*(?:Main Body|بدنه‌ی اصلی):\*\*\s)([\s\S]*?)(?=\*\*(?:Conclusion|نتیجه‌گیری):\*\*)/
        )?.[0] || "",
      conclusion:
        content.match(
          /(?<=\*\*(?:Conclusion|نتیجه‌گیری):\*\*\s)([\s\S]*)/
        )?.[0] || "",
    };
  }
  return format;
};
