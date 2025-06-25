'use client'
import { Button } from '@/view/components/ui/button';
import { Calendar } from '@/view/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/view/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/view/components/ui/dialog';
import { Label } from '@/view/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/view/components/ui/select';
import { Separator } from '@radix-ui/react-select';
import { ptBR } from 'date-fns/locale';
import { format, setDefaultOptions } from 'date-fns'
import { CalendarIcon, CheckCircle, Clock, User, Video } from 'lucide-react';
import React, { useState } from 'react';
import { useMeetingCard } from './useMeetingCard';
import { Controller } from 'react-hook-form';
import { IMeeting } from '@/@shared/interfaces/Meeting';
import { cn } from '@/@shared/utils/tw-merge';

setDefaultOptions({
  locale: ptBR
})


interface CustomerInfo {
  id: string
  name: string
  company: string
  email: string
  phone?: string
}

interface CustomerMeetingSchedulerProps {
  customer: CustomerInfo
  meeting?: IMeeting
  wwt_account_id: number
}


export const MeetingCard: React.FC<CustomerMeetingSchedulerProps> = ({ customer, meeting, wwt_account_id }) => {
  const { control, register, onHandleSubmit, isModalOpen, setIsModalOpen, onHandleCancel, errors, disabledData, disabledTime, timeOptions, formatTime } = useMeetingCard({
    accountId: customer.id,
    meeting,
    wwt_account_id
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          {meeting ? "Reuniõa agendada" : "Agendar Reunião"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info Display */}
        <div className="flex items-center gap-3 p-3 bg-background rounded-lg">
          <User className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.company}</p>
            <p className="text-xs text-muted-foreground">{customer.email}</p>
          </div>
        </div>

        {meeting ? (
          /* Meeting Information Display */
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">Reunião confirmada</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{format(new Date(meeting.slot.start), "EEEE, MMMM dd, yyyy")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{formatTime(meeting.slot)}</span>
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
          </div>
        ) : (
          /* Original Scheduling Interface */
          <>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <Video className="w-4 h-4 mr-2" />
                  Agendar nova reunião
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-h-[90vh] sm:max-w-[40vw] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Agendar treinamento com {customer.name}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={onHandleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Calendar */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Selecione a data</Label>
                      <div className="w-full mt-2">
                        <Controller
                          control={control} 
                          name='date'
                          render={({ field }) => (
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={disabledData}
                              className={
                                cn(
                                  "rounded-md w-full border",
                                  errors.date?.message && "border-destructive"
                                )
                              }
                            />
                          )}
                        />
                        <small className={
                          cn(
                            'text-xs text-destructive hidden mt-1',
                            errors.date?.message && "block"
                          )
                        }>{errors.date?.message}</small>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Form Fields */}
                  <div className="space-y-4">
                    {/* Customer Info (Read-only) */}
                    <div className="p-4 bg-card rounded-lg">
                      <Label className="text-sm font-medium text-muted-foreground">Reunião com</Label>
                      <div className="mt-2 space-y-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.company}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{customer.email}</span>
                          {customer.phone && (
                            <>
                              <span>•</span>
                              <span>{customer.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col w-full'>
                      <Label htmlFor="time" className="text-sm font-medium">
                        Horarios disponiveis *
                      </Label>
                      <Controller 
                        control={control}
                        name='time'
                        render={({ field }) => (
                          <>
                          <Select value={field.value} disabled={disabledTime} onValueChange={field.onChange}>
                            <SelectTrigger className={
                              cn(
                                "mt-2 w-full",
                                errors.time?.message && "border-destructive"
                              )
                            }>
                              <SelectValue placeholder="Selecione um horario" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map(({ id, start, end }) => (
                                <SelectItem key={id} value={id}>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {formatTime({ start, end })}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <small className={
                            cn(
                              'text-xs text-destructive hidden',
                              errors.time?.message && "block"
                            )
                          }>
                            {errors.time?.message}
                          </small>
                          </>
                        )}
                      />
                      
                    </div>


                    <div>
                      <Label htmlFor="notes" className="text-sm font-medium">
                        Notas (Opcional)
                      </Label>
                      <textarea
                        id="notes"
                        placeholder="adicione notas da reunião, e até link da chamada"
                        className="mt-2 w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        {...register('notes')}
                      />
                    </div>


                    <Separator />

                    <div className="flex  gap-3">
                      <Button onClick={onHandleCancel} variant="outline" className="flex-1">
                        Cancelar
                      </Button>
                      <Button
                        type='submit'
                        className="flex-1"
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        Agendar
                      </Button>
                    </div>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardContent>
    </Card>
  )
}
