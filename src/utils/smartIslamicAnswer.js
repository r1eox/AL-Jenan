export async function smartIslamicAnswer(messages, input) {
  // سؤال عن سورة الناس أو رقم 114
  if (/سورة\s*الن(?:اس|اس)|\b114\b/.test(input)) {
    const res = await fetch("http://api.alquran.cloud/v1/surah/114");
    const data = await res.json();
    return `سورة الناس (${data.data.englishName}): ${data.data.ayahs.length} آية.\n\n${data.data.ayahs.map(a => a.text).join(" ")}`;
  }
  // سؤال عن تفسير سورة الناس
  if (/تفسير.*(الناس|114)/.test(input)) {
    const res = await fetch("https://quranenc.com/api/v1/translation/sura/arabic_moyassar/114");
    const data = await res.json();
    return `تفسير سورة الناس:\n${data.result.map(a => a.aya_text).join(" ")}`;
  }
  // سؤال عن حديث أو "قال الرسول"
  if (/حديث|قال الرسول|النبي/.test(input)) {
    const res = await fetch("https://hadis-api-id.vercel.app/hadith/abu-dawud?page=2&limit=300");
    const data = await res.json();
    return `حديث:\n${data.data[0]?.arab || "لم يتم العثور على حديث مناسب."}`;
  }
  // سؤال عن أذكار أو ذكر
  if (/ذكر|اذكار|أذكار/.test(input)) {
    const res = await fetch("https://raw.githubusercontent.com/nawafalqari/azkar-api/56df51279ab6eb86dc2f6202c7de26c8948331c1/azkar.json");
    const data = await res.json();
    return `ذكر:\n${data[0]?.content || "لم يتم العثور على ذكر مناسب."}`;
  }
  // سؤال عن حصن المسلم
  if (/حصن المسلم/.test(input)) {
    const res = await fetch("https://www.hisnmuslim.com/api/ar/27.json");
    const data = await res.json();
    return `من حصن المسلم:\n${data[0]?.zekr || "لم يتم العثور على نتيجة."}`;
  }
  // إذا لم يتعرف على نوع السؤال
  return null;
}