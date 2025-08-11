import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CalendarIcon, CheckCircle, Clock, User } from 'lucide-react';
import { IBfleetClientEntity } from '@/@shared/interfaces/bfleet-client-entity';
import { format } from 'date-fns';
import { IScheduleSlot } from '@/@shared/interfaces/schedule-slot';
import { Button } from '../components/ui/button';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { MeetingCancel } from '../dialog/MeetingCancel';
import { useDisclosure } from '@/@shared/hooks/use-disclosure';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const ViewMeetingForm: React.FC<{ data: IBfleetClientEntity, onClose: () => void }> = ({ data, onClose }) => {
  
  const meeting = useMemo(() => {
    return data.Meeting[0];
  }, [data])

  const router = useRouter()
  

  const formatTime = ({ end, start }: Pick<IScheduleSlot, 'start' | 'end'>) => {
    const startTime = format(start, 'HH:mm');
    const endTime = format(end, 'HH:mm')
    return [startTime, endTime].join(' - ')
  }

  const handleCancelMeeting = async () => {
    try {
      if(!meeting) return

      const response = await fetch(`/api/meeting/cancel`, {
        method: "POST",
        body: JSON.stringify({ meeting_id: meeting.id }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      const { success } = await response.json()
      if(!success) {
        toast.error("Falha ao cancelar agendamento!")
        
      }
      
      toast.success("Agendamento cancelado com sucesso!")
    }
    finally {
      meetingCancelDisclousure.onClose()
      onClose();
      router.refresh()
    }
  }

  const meetingCancelDisclousure = useDisclosure();
  
  return (
    <DialogContent className="w-full max-h-[90vh] sm:max-w-[40vw] md:max-w-[70vw] lg:max-w-[55vw] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Agendamento com {data?.bwfleet.name}
        </DialogTitle>
      </DialogHeader>
    <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {meeting ? `Reunião ${meeting.status === 'CANCELED' ? "Cancelada" : "Agendada"}` : "Agendar Reunião"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{data.bwfleet.name}</p>
                <p className="text-sm text-muted-foreground">{data.bwfleet.name}</p>
                <p className="text-xs text-muted-foreground">{data.bwfleet.email}</p>
              </div>
            </div>
    
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-800">Reunião confirmada</span>
                  </div>
    
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{format(new Date(meeting.slot!.start), "EEEE, MMMM dd, yyyy")}</span>
                    </div>
    
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{formatTime(meeting.slot!)}</span>
                    </div>
    
                    {meeting.description && (
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 mt-0.5">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">Notas:</p>
                          <p className="text-muted-foreground text-xs">{meeting.description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Button onClick={meetingCancelDisclousure.onOpen} className='w-full'>Cancelar Reunião</Button>
                  <Dialog open={meetingCancelDisclousure.isOpen} onOpenChange={meetingCancelDisclousure.onClose}>
                    <DialogContent className="w-full max-h-[30vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          Cancelar agendamento com {data.bwfleet.name}
                        </DialogTitle>
                          <MeetingCancel
                            handleCancel={meetingCancelDisclousure.onClose}
                            handleConfirm={handleCancelMeeting}
                          />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
          </CardContent>
        </Card>
        </DialogContent>
  )
}
