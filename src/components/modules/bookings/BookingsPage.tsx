import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  User,
  PlusCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
import { Booking, BookingStatus } from '../../../types';
import { Button } from '../../ui/Button';
import { StatusBadge } from '../../ui/StatusBadge';
import { Modal } from '../../ui/Modal';
import { Input } from '../../ui/Input';
import { EmptyState } from '../../shared/EmptyState';
import { formatCurrency, formatDateTime } from '../../../lib/utils';

export const BookingsPage: React.FC = () => {
  const { currentTenant, websites } = useTenant();

  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);

  // New Booking form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceName, setServiceName] = useState('Consultation Appointment');
  const [bookingTime, setBookingTime] = useState('');
  const [price, setPrice] = useState('250');

  const bookings = dataService.getBookings(currentTenant.id);

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
    if (filter === 'completed') return b.status === 'completed';
    if (filter === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !bookingTime) return;

    dataService.createBooking(currentTenant.id, {
      website_id: websites[0]?.id || '',
      customer_name: customerName,
      customer_email: customerEmail,
      service_name: serviceName,
      booking_time: new Date(bookingTime).toISOString(),
      duration_minutes: 60,
      status: 'confirmed',
      price: parseFloat(price) || 0,
    });

    setIsNewBookingModalOpen(false);
    setCustomerName('');
    setCustomerEmail('');
    setBookingTime('');
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Bookings & Schedule</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Appointment flow synchronized with client booking widgets.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewBookingModalOpen(true)}
          icon={<PlusCircle className="w-3.5 h-3.5" />}
        >
          Schedule Appointment
        </Button>
      </div>

      {/* Integration Readiness Banner */}
      <div className="p-3.5 rounded-lg border border-border bg-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-muted border border-border flex items-center justify-center text-foreground">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground flex items-center gap-2 font-mono">
              <span>CALENDAR WEBHOOK ENDPOINT</span>
              <span className="text-[10px] text-emerald-500 font-bold">ACTIVE</span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Two-way sync architecture for Google Calendar, Outlook, and automated SMS alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/80">
        {(['upcoming', 'completed', 'cancelled', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium capitalize rounded-md transition-colors min-h-[36px] ${
              filter === tab
                ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List (1 col mobile, 2 col tablet, 3 col desktop) */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6 text-foreground" />}
          title="No bookings in this view"
          description="Appointments booked through your website's scheduling system will appear here."
          actionLabel="Add Appointment"
          onAction={() => setIsNewBookingModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-card border border-border rounded-lg p-4 shadow-xs space-y-3 hover:border-border/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                    {b.service_name}
                  </h3>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5 font-mono">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{formatDateTime(b.booking_time)}</span>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border text-xs space-y-0.5">
                <div className="font-medium text-foreground flex items-center gap-1.5">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span>{b.customer_name}</span>
                </div>
                <div className="text-muted-foreground font-mono text-[11px] truncate">
                  {b.customer_email}
                </div>
                {b.customer_phone && (
                  <div className="text-muted-foreground font-mono text-[10px]">
                    {b.customer_phone}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border font-mono">
                <span>Fee</span>
                <span className="font-bold text-emerald-500 tabular-nums">
                  {formatCurrency(b.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Booking Modal */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title="Schedule Appointment"
        description="Book a client directly into the schedule."
        maxWidth="md"
      >
        <form onSubmit={handleCreateBooking} className="space-y-3.5">
          <Input
            label="Client Full Name"
            placeholder="e.g., Victoria Adams"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <Input
            label="Client Email"
            type="email"
            placeholder="client@domain.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
          <Input
            label="Service / Appointment Type"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date & Time"
              type="datetime-local"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              required
            />
            <Input
              label="Fee ($)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsNewBookingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
