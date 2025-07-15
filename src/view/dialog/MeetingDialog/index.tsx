'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { CalendarIcon, Clock, Video } from 'lucide-react';
import { Label } from '../../components/ui/label';
import { Controller } from 'react-hook-form';
import { Calendar } from '../../components/ui/calendar';
import { cn } from '@/@shared/utils/tw-merge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Separator } from '../../components/ui/separator';
import { useMeetingDialog } from './useMeetingDialog';

export const MeetingDialog: React.FC = () => {

  const { control, disabledData, disabledTime, register, setIsModalOpen, errors, isModalOpen, timeOptions, onHandleCancel, formatTime } = useMeetingDialog();

  return (
    <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
      <DialogTrigger  onClick={() => setIsModalOpen(true)} asChild>
        <Button  className="w-full" size="lg">
          <Video className="w-4 h-4 mr-2" />
            Agendar nova reunião
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90vh] sm:max-w-[40vw] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Agendar treinamento com {"customer.name"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={() => console.log("onHandleSubmit")} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                        <p className="font-medium">{"customer.name"}</p>
                        <p className="text-sm text-muted-foreground">{"customer.company"}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{"customer.email"}</span>
                          {/* {customer.phone && (
                            <>
                              <span>•</span>
                              <span>{customer.phone}</span>
                            </>
                          )} */}
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
  )
}