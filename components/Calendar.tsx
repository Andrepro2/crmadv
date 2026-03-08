'use client';

import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import { Plus, Calendar as CalendarIcon, List, Grid3X3, Clock, Scale } from 'lucide-react';
import { motion } from 'motion/react';

const events = [
  { id: '1', title: 'Audiência de Conciliação', start: '2026-03-05T14:00:00', extendedProps: { type: 'audiencia', location: 'Fórum Central' }, color: '#ef4444' },
  { id: '2', title: 'Reunião com Cliente', start: '2026-03-08T10:00:00', extendedProps: { type: 'reuniao', location: 'Escritório' }, color: '#6366f1' },
  { id: '3', title: 'Prazo para Manifestação', start: '2026-03-10T23:59:00', extendedProps: { type: 'prazo', location: 'Sistema E-SAJ' }, color: '#f59e0b' },
];

export function Calendar() {
  const calendarRef = useRef<FullCalendar>(null);

  const changeView = (view: string) => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Agenda Jurídica</h1>
          <p className="text-text-muted mt-1">Gerencie seus compromissos e prazos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-card border border-white/10 rounded-xl p-1 flex items-center">
            <button 
              onClick={() => changeView('dayGridMonth')}
              className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="Mês"
            >
              <Grid3X3 size={18} />
            </button>
            <button 
              onClick={() => changeView('timeGridWeek')}
              className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="Semana"
            >
              <Clock size={18} />
            </button>
            <button 
              onClick={() => changeView('listWeek')}
              className="p-2 text-text-muted hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="Lista"
            >
              <List size={18} />
            </button>
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all whitespace-nowrap">
            <Plus size={18} />
            Novo Evento
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-card border border-white/5 rounded-3xl p-6 shadow-xl">
          <div className="calendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              locale={ptBrLocale}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: ''
              }}
              events={events}
              height="auto"
              eventClassNames="rounded-lg border-none px-2 py-1 text-xs font-bold shadow-sm"
              dayMaxEvents={true}
              themeSystem="standard"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock size={20} className="text-primary" />
              Próximos Eventos
            </h3>
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="group cursor-pointer">
                  <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-transparent hover:border-primary/30 hover:bg-primary/5 transition-all">
                    <div className="flex flex-col items-center justify-center min-w-[50px] py-1 bg-darker rounded-xl border border-white/5">
                      <span className="text-lg font-bold text-primary">{event.start.split('T')[0].split('-')[2]}</span>
                      <span className="text-[10px] uppercase font-bold text-text-muted">Mar</span>
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">{event.title}</h4>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {event.start.split('T')[1].substring(0, 5)}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5 truncate flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {event.extendedProps.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2">Dica LexPro</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Mantenha seus prazos atualizados para receber notificações automáticas via WhatsApp 24h antes.
              </p>
            </div>
            <Scale size={80} className="absolute -bottom-4 -right-4 text-white/5 rotate-12" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .fc {
          --fc-border-color: rgba(255, 255, 255, 0.05);
          --fc-button-bg-color: rgba(99, 102, 241, 0.1);
          --fc-button-border-color: rgba(99, 102, 241, 0.2);
          --fc-button-hover-bg-color: rgba(99, 102, 241, 0.2);
          --fc-button-active-bg-color: #6366f1;
          --fc-today-bg-color: rgba(99, 102, 241, 0.1);
          --fc-page-bg-color: transparent;
          background: transparent;
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
        }
        .fc .fc-button {
          font-weight: 600;
          text-transform: capitalize;
          border-radius: 10px;
        }
        .fc .fc-col-header-cell-cushion {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #94a3b8;
          padding: 12px 0;
        }
        .fc .fc-daygrid-day-number {
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
          padding: 8px;
        }
        .fc .fc-daygrid-day.fc-day-today .fc-daygrid-day-number {
          color: #6366f1;
        }
      `}</style>
    </div>
  );
}
