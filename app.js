const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const pageNames = {
 dashboard:["داشبورد","نمای کلی وضعیت فروشگاه شما در یک نگاه."],
 sales:["فروش و فاکتورها","ثبت فروش، صدور فاکتور و پیگیری تسویه‌ها."],
 inventory:["انبار و موجودی","مدیریت کالاها، وزن، عیار و گردش موجودی."],
 customers:["مشتریان","پرونده مشتریان و سوابق خرید و پرداخت."],
 purchases:["خرید طلا","ثبت خرید از تأمین‌کنندگان و خرید از مشتریان."],
 cash:["صندوق و حسابداری","مدیریت دریافت‌ها، پرداخت‌ها و حساب‌های مالی."],
 reports:["گزارش‌ها","گزارش فروش، موجودی، سود و گردش حساب."],
 settings:["تنظیمات برنامه","تنظیم واحد پول، کاربران، امنیت و پشتیبان‌گیری."]
};
const actionNames = {invoice:"صدور فاکتور جدید",product:"افزودن کالا",customer:"ثبت مشتری جدید",payment:"ثبت پرداخت"};
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.remove("hidden");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.add("hidden"),3200)}
function switchPage(page){
 $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
 $("#pageTitle").textContent=pageNames[page]?.[0]||"داشبورد";
 $("#dashboardPage").classList.toggle("hidden",page!=="dashboard");
 $("#secondaryPage").classList.toggle("hidden",page==="dashboard" || page==="debtors");
 $("#debtorsPage").classList.toggle("hidden",page!=="debtors");
 if(page!=="dashboard"){
  $("#secondaryHeading").textContent=pageNames[page][0];
  $("#secondaryDescription").textContent=pageNames[page][1];
  $("#emptyTitle").textContent=page==="sales"?"آماده طراحی فرم فروش":`بخش «${pageNames[page][0]}» آماده توسعه است`;
  $("#emptyDescription").textContent="در مرحله بعد فیلدهای تخصصی، جست‌وجو، فیلترها، گزارش‌ها و اتصال امن به سرور مرکزی برای این بخش ساخته می‌شود.";
  $("#secondaryAction").textContent="＋ "+(page==="sales"?"صدور فاکتور":page==="inventory"?"افزودن کالا":page==="customers"?"ثبت مشتری":"ثبت مورد جدید");
 }
 $("#sidebar").classList.remove("open");$(".sidebar-backdrop")?.classList.remove("show");
}
$$(".nav-item").forEach(b=>b.addEventListener("click",()=>switchPage(b.dataset.page)));
$("#backDashboard").addEventListener("click",()=>switchPage("dashboard"));
$("#viewAll").addEventListener("click",()=>switchPage("sales"));
$("#secondaryAction").addEventListener("click",()=>{if($("#pageTitle").textContent==="فروش و فاکتورها")openInvoice();else showToast("فرم این بخش در مرحله بعد ساخته می‌شود.")});
$("#menuToggle").addEventListener("click",()=>{const open=$("#sidebar").classList.toggle("open");let backdrop=$(".sidebar-backdrop");if(!backdrop){backdrop=document.createElement("div");backdrop.className="sidebar-backdrop";document.body.appendChild(backdrop);backdrop.addEventListener("click",()=>{$("#sidebar").classList.remove("open");backdrop.classList.remove("show")})}backdrop.classList.toggle("show",open)});
$("#closeNotice").addEventListener("click",()=>$(".notice").remove());
const modal=$("#modalBackdrop");
function openInvoice(){modal.classList.remove("hidden");$("#previewResult").classList.add("hidden");$("#invoiceForm").classList.remove("hidden");calcTotal();setTimeout(()=>modal.querySelector('[name="customer"]').focus(),50)}
function closeInvoice(){modal.classList.add("hidden")}
$("#newInvoice").addEventListener("click",openInvoice);
$$("[data-action]").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.action==="invoice")openInvoice();else showToast(actionNames[b.dataset.action]+" در مرحله بعد فعال می‌شود.")}));
$("#closeModal").addEventListener("click",closeInvoice);$("#cancelModal").addEventListener("click",closeInvoice);
modal.addEventListener("click",e=>{if(e.target===modal)closeInvoice()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeInvoice()});
const money=n=>new Intl.NumberFormat("fa-IR",{maximumFractionDigits:0}).format(Math.max(0,Number(n)||0));
function calcTotal(){
 const f=$("#invoiceForm");const weight=Number(f.weight.value)||0,price=Number(f.price.value)||0,wage=Number(f.wage.value)||0,profit=Number(f.profit.value)||0,tax=Number(f.tax.value)||0;
 $("#invoiceTotal").textContent=money(weight*price+wage+profit+tax)+" تومان";
}
$("#invoiceForm").addEventListener("input",calcTotal);
$("#invoiceForm").addEventListener("submit",e=>{
 e.preventDefault();const f=e.currentTarget;const data=new FormData(f);const weight=Number(data.get("weight"))||0,price=Number(data.get("price"))||0,wage=Number(data.get("wage"))||0,profit=Number(data.get("profit"))||0,tax=Number(data.get("tax"))||0,total=weight*price+wage+profit+tax;
 $("#previewResult").innerHTML=`پیش‌فاکتور نمایشی برای <strong>${escapeHtml(data.get("customer"))}</strong> آماده شد.<br>نوع معامله: ${escapeHtml(data.get("kind"))}<br>وزن: ${money(weight)} گرم · عیار: ${escapeHtml(data.get("purity"))}<br>مبلغ تقریبی: <strong>${money(total)} تومان</strong><br><small>این اطلاعات ذخیره نشده است و فاکتور رسمی یا مالیاتی محسوب نمی‌شود.</small>`;
 $("#previewResult").classList.remove("hidden");showToast("پیش‌نمایش محاسبه شد؛ اطلاعات ذخیره نشده است.");
});
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#periodButton").addEventListener("click",()=>showToast("فیلتر بازه زمانی در مرحله توسعه گزارش‌ها فعال می‌شود."));
$("#chartPeriod").addEventListener("click",()=>showToast("نمودار فعلاً داده نمایشی دارد."));
$("#todayDate").textContent=new Intl.DateTimeFormat("fa-IR-u-ca-persian",{weekday:"short",day:"numeric",month:"long"}).format(new Date());
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>{}))}

const debtorSearch=$("#debtorSearch");
if(debtorSearch){debtorSearch.addEventListener("input",()=>{
 const q=debtorSearch.value.trim().toLocaleLowerCase("fa");
 $$("#debtorsTable tbody tr").forEach(row=>row.classList.toggle("hidden",!row.textContent.toLocaleLowerCase("fa").includes(q)));
});}
$("#exportDebtors")?.addEventListener("click",()=>{
 const rows=[...$("#debtorsTable").querySelectorAll("tr")].filter(r=>!r.classList.contains("hidden")).map(r=>[...r.children].slice(0,6).map(c=>c.innerText.trim()));
 const csv="\uFEFF"+rows.map(row=>row.map(v=>'"'+v.replace(/"/g,'""')+'"').join(",")).join("\r\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
 const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="aza-gold-debtors.csv";a.click();URL.revokeObjectURL(url);
 showToast("فهرست قابل مشاهده به‌صورت CSV خروجی گرفته شد.");
});
