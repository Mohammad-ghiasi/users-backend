export const setTimeoutMiddleware = (req, res, next) => {
    // ایجاد یک تایمر برای تایم‌اوت
    const timeoutId = setTimeout(() => {
        console.error("⏳ Request timed out");
        if (!res.headersSent) {
            res.status(504).json({ error: "Request timed out" });
        }
        // اطمینان از این که مسیر بعدی اجرا نشود
        req.timedOut = true;
    }, 30000); // 30 ثانیه
    // ذخیره تایمر در `res.locals` تا در پردازش اصلی بتوان آن را متوقف کرد
    res.locals.timeoutId = timeoutId;
    // اجرا مسیر اصلی
    next();
};
// برای جلوگیری از تایم‌اوت بی‌مورد، قبل از پاسخ دادن، تایمر را حذف کن
export const clearTimeoutMiddleware = (req, res, next) => {
    if (res.locals.timeoutId) {
        clearTimeout(res.locals.timeoutId);
    }
    next();
};
