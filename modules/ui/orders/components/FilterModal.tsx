import React, { useState } from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { X } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { useSafeArea } from '@/provider/safeAreaProvider';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilter }) => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const controls = useAnimation();
  const { safeAreaClasses} = useSafeArea()

  const handleApplyFilter = () => {
    onApplyFilter(dateRange.from, dateRange.to);
    onClose();
  };

  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'PP')} - ${format(dateRange.to, 'PP')}`;
    }
    if (dateRange.from) {
      return `${format(dateRange.from, 'PP')} - ...`;
    }
    return 'Select date range';
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100) {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else if (info.offset.y < -100) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
    controls.start({ y: 0 });
  };

  const calendarStyles = {
    head_cell: { width: '14.28%', textAlign: 'center' as const },
    cell: { width: '14.28%', height: '2.5rem', textAlign: 'center' as const },
    day: { width: '100%', height: '100%' },
    nav: { display: 'none' },
    // Remove the caption style to show the month header
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-full h-full py-4 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${safeAreaClasses} pad-top pad-bottom`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col h-full bg-white bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Filter Orders</h2>
          </div>
          
          <motion.div 
            className="flex-grow overflow-hidden"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
          >
            <div className="p-4 space-y-4">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(value: any) => setDateRange(value)}
                month={currentMonth}
                numberOfMonths={1}
                className="w-full"
                styles={calendarStyles}
              />
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(value: any) => setDateRange(value)}
                month={addMonths(currentMonth, 1)}
                numberOfMonths={1}
                className="w-full"
                styles={calendarStyles}
              />
            </div>
          </motion.div>
          
          <div className="p-4 border-t">
            <div className="mb-4 text-center font-medium">
              {formatDateRange()}
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleApplyFilter}>Apply Filter</Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
