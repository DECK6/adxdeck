// Google Calendar busy intervals (calendar-busy.v1 from dexa-calendar-bridge) reduced to what the
// dashboard needs: when the master is busy, never what the events are, who attends or which
// account owns the calendar (Google names the primary calendar after the account email).
const iso=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\dT.*(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
const dateOnly=v=>typeof v==='string'&&/^\d{4}-\d\d-\d\d$/.test(v)&&Number.isFinite(Date.parse(v));
export function sanitizeCalendar(input){
 if(!input||input.schemaVersion!=='calendar-busy.v1'||!Array.isArray(input.busy))throw Error('Invalid calendar ledger');
 if(!iso(input.updatedAt)||!dateOnly(input.from)||!dateOnly(input.to))throw Error('Invalid calendar ledger dates');
 const busy=input.busy.map(b=>{
  if(!iso(b?.start)||!iso(b?.end)||Date.parse(b.end)<=Date.parse(b.start))throw Error('Invalid busy interval');
  return {start:b.start,end:b.end,allDay:b.allDay===true};
 });
 return {schemaVersion:'calendar-busy.v1',updatedAt:input.updatedAt,from:input.from,to:input.to,timeZone:'Asia/Seoul',calendarCount:Array.isArray(input.calendars)?input.calendars.length:0,busy};
}
