import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const cfg = window.APP_CONFIG || {};
const configured = /^https:\/\/.+\.supabase\.co\/?$/.test(cfg.SUPABASE_URL || '') && cfg.SUPABASE_ANON_KEY && !cfg.SUPABASE_ANON_KEY.startsWith('PEGA_');
const db = configured ? createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
const $ = id => document.getElementById(id);
const form = $('rsvp-form');
const arrivalBlock = $('arrival-block');
const lateBlock = $('late-block');
const lateMessage = $('late-message');
const status = $('form-status');
const submit = $('submit-rsvp');
function selected(name){return document.querySelector(`input[name="${name}"]:checked`)?.value;}
function updateForm(){
  const attending = selected('attendance') === 'si';
  const late = selected('punctuality') === 'tarde';
  arrivalBlock.hidden = !attending;
  lateBlock.hidden = !attending || !late;
  lateMessage.required = attending && late;
}
document.querySelectorAll('input[name="attendance"], input[name="punctuality"]').forEach(el => el.addEventListener('change', updateForm));
updateForm();
function showStatus(message,type='error'){status.textContent=message;status.className='form-status '+type;}
if(!configured) showStatus('El formulario estará disponible cuando los organizadores conecten su base de datos. Consulta el archivo README.md para activarlo.');
form.addEventListener('submit', async event => {
  event.preventDefault();
  if($('website').value) return;
  if(!configured) return showStatus('Aún falta configurar Supabase para guardar las confirmaciones.');
  const name = $('guest-name').value.trim().replace(/\s+/g,' ');
  const attendance = selected('attendance');
  const punctuality = attendance === 'si' ? selected('punctuality') : 'no_aplica';
  const late = lateMessage.value.trim();
  const message = $('guest-message').value.trim();
  if(name.length < 3 || name.length > 100) return showStatus('Escribe tu nombre y apellido (al menos 3 caracteres).');
  if(attendance === 'si' && punctuality === 'tarde' && !late) return showStatus('Indícanos a qué hora aproximadamente podrás llegar.');
  if(late.length > 500 || message.length > 500) return showStatus('El mensaje es demasiado largo.');
  submit.disabled=true;showStatus('Guardando tu respuesta...','');
  const {error} = await db.from('confirmaciones').insert({nombre:name,asistira:attendance==='si',llegada:punctuality,detalle_llegada:punctuality==='tarde'?late:null,mensaje:message||null});
  submit.disabled=false;
  if(error){console.error(error);return showStatus('No se pudo enviar tu confirmación. Inténtalo nuevamente o comunícate con los organizadores.');}
  form.reset();updateForm();showStatus('¡Muchas gracias! Tu respuesta quedó registrada correctamente. Nos alegra contar contigo en esta ocasión especial.','success');
  status.scrollIntoView({behavior:'smooth',block:'center'});
});
const eventDate = new Date('2026-11-28T17:00:00-04:00').getTime();
function countdown(){
  const remaining = Math.max(0, eventDate - Date.now());
  const vals=[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(vals[i]).padStart(2,'0'));
  if(!remaining)$('countdown-note').textContent='¡Llegó el gran día! Gracias por acompañarnos en esta celebración.';
}
countdown();setInterval(countdown,1000);
