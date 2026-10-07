import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  User,
  PlusCircle,
} from 'lucide-react';
import { useTenant } from '../../../context/TenantContext';
import { dataService } from '../../../services/dataService';
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

  const isHospitality = currentTenant.slug === 'velvet-vine';
  const pageTitle = isHospitality ? 'Reservations' : 'Appointments';
  const singularLabel = isHospitality ? 'reservation' : 'appointment';

  // New Booking form
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceName, setServiceName] = useState(
    isHospitality ? 'Dinner Reservation (4 guests)' : 'Initial Consultation'
  );
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

  const tabLabels: Record<'upcoming' | 'completed' | 'cancelled' | 'all', string> = {
    upcoming: `Upcoming ${pageTitle.toLowerCase()}`,
    completed: 'Completed',
    cancelled: 'Cancelled',
    all: 'All',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-border">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {pageTitle} booked through {currentTenant.name}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsNewBookingModalOpen(true)}
          icon={<PlusCircle className="w-3.5 h-3.5" />}
        >
          Add {singularLabel}
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/80">
        {(['upcoming', 'completed', 'cancelled', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors min-h-[36px] ${
              filter === tab
                ? 'bg-accent text-accent-foreground font-semibold shadow-2xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      {filteredBookings.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6 text-foreground" />}
          title={`No ${pageTitle.toLowerCase()} yet`}
          description={`${pageTitle} booked on your website will appear here.`}
          actionLabel={`Add ${singularLabel}`}
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
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{formatDateTime(b.booking_time)}</span>
                  </div>
                </div>
                <StatusBadge status={b.status} />
              </div>

              <div className="p-2.5 rounded bg-muted/40 border border-border text-xs space-y-0.5">
                <div className="font-medium text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{b.customer_name}</span>
                </div>
                <div className="text-muted-foreground truncate">
                  {b.customer_email}
                </div>
                {b.customer_phone && (
                  <div className="text-muted-foreground">
                    {b.customer_phone}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                <span>Amount</span>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatCurrency(b.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Appointment Modal */}
      <Modal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        title={`Add ${singularLabel}`}
        description={`Schedule a new ${singularLabel} for ${currentTenant.name}.`}
        maxWidth="md"
      >
        <form onSubmit={handleCreateBooking} className="space-y-3.5">
          <Input
            label="Full name"
            placeholder="e.g., Victoria Adams"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <Input
            label="Email address"
            type="email"
            placeholder="client@domain.com"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            required
          />
          <Input
            label="Service"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date & time"
              type="datetime-local"
              value={bookingTime}
              onChange={(e) => setBookingTime(e.target.value)}
              required
            />
            <Input
              label="Amount ($)"
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
              Save {singularLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
