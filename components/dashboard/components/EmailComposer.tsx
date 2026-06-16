'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Mail, CheckCircle, XCircle, Loader2, Eye, Pencil } from 'lucide-react'
import { Caregiver } from '../../../types/caregiver'

function interpolate(template: string, record: Caregiver): string {
    return template
        .replace(/{{nombre}}/g, record.first_name)
        .replace(/{{apellido}}/g, record.last_name)
        .replace(/{{email}}/g, record.email ?? '')
        .replace(/{{teléfono}}/g, record.phone ?? '')
}

type SendStatus = 'idle' | 'sending' | 'done'
type RecipientStatus = 'pending' | 'sent' | 'error'

interface RecipientResult {
    record: Caregiver
    status: RecipientStatus
    error?: string
}

interface Props {
    isOpen: boolean
    onClose: () => void
    recipients: Caregiver[]
}

export function EmailComposer({ isOpen, onClose, recipients }: Props) {
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')
    const [sendStatus, setSendStatus] = useState<SendStatus>('idle')
    const [results, setResults] = useState<RecipientResult[]>([])
    const [showPreview, setShowPreview] = useState(false)

    // Podgląd — używamy pierwszego odbiorcy jako przykładu
    const previewRecord = recipients[0]
    const previewSubject = previewRecord ? interpolate(subject, previewRecord) : subject
    const previewMessage = previewRecord ? interpolate(message, previewRecord) : message

    function handleClose() {
        if (sendStatus === 'sending') return // nie zamykaj podczas wysyłki
        setSendStatus('idle')
        setResults([])
        setSubject('')
        setMessage('')
        setShowPreview(false)
        onClose()
    }

    function insertVariable(variable: string) {
        setMessage(prev => prev + `{{${variable}}}`)
    }

    async function handleSend() {
        if (!subject.trim() || !message.trim()) return

        setSendStatus('sending')
        setResults(
            recipients.map(r => ({ record: r, status: 'pending' }))
        )

        try {
            const response = await fetch('/api/send-emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients: recipients.map(r => ({
                        id: r.id,
                        first_name: r.first_name,
                        last_name: r.last_name,
                        email: r.email,
                        phone: r.phone,
                    })),
                    subject,
                    message,
                }),
            })

            const data = await response.json()

            setResults(
                recipients.map(r => {
                    const result = data.results?.find((res: any) => res.id === r.id)
                    return {
                        record: r,
                        status: result?.success ? 'sent' : 'error',
                        error: result?.error,
                    }
                })
            )
        } catch (err) {
            setResults(
                recipients.map(r => ({
                    record: r,
                    status: 'error',
                    error: 'Error de conexión con el servidor',
                }))
            )
        } finally {
            setSendStatus('done')
        }
    }

    const allSent = results.every(r => r.status === 'sent')
    const sentCount = results.filter(r => r.status === 'sent').length
    const errorCount = results.filter(r => r.status === 'error').length

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Enviar correos electrónicos
                        <Badge variant="secondary">{recipients.length} destinatario{recipients.length > 1 && 's'}</Badge>
                    </DialogTitle>
                </DialogHeader>

                {/* --- Widok kompozytora --- */}
                {sendStatus === 'idle' && (
                    <div className="space-y-5">
                        {/* Zakładki: Edytor / Podgląd */}
                        <div className="flex gap-2">
                            <Button
                                variant={showPreview ? 'ghost' : 'secondary'}
                                size="sm"
                                onClick={() => setShowPreview(false)}
                            >
                                <Pencil className="h-3.5 w-3.5 mr-1.5" />
                                Editor
                            </Button>
                            <Button
                                variant={showPreview ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => setShowPreview(true)}
                                disabled={!subject && !message}
                            >
                                <Eye className="h-3.5 w-3.5 mr-1.5" />
                                Vista previa
                                {previewRecord && (
                                    <span className="ml-1 text-xs text-muted-foreground">
                    ({previewRecord.first_name}{" "}{previewRecord.last_name})
                  </span>
                                )}
                            </Button>
                        </div>

                        {!showPreview ? (
                            <>
                                {/* Temat */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="subject">Asunto del mensaje</Label>
                                    <Input
                                        id="subject"
                                        placeholder="p. ej., ¡Hola, {{nombre}}, tenemos algo para ti!"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                    />
                                </div>

                                {/* Zmienne do wstawienia */}
                                <div className="space-y-1.5">
                                    <Label>Inserta la variable</Label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['nombre', 'apellido', 'email', 'teléfono'].map(v => (
                                            <Button
                                                key={v}
                                                variant="outline"
                                                size="sm"
                                                onClick={() => insertVariable(v)}
                                                className="font-mono text-xs"
                                            >
                                                {`{{${v}}}`}
                                            </Button>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Las variables se sustituirán por los datos de cada destinatario.
                                    </p>
                                </div>

                                {/* Treść */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="message">Contenido del mensaje</Label>
                                    <Textarea
                                        id="message"
                                        placeholder={`Hola, {{nombre}},\n\nTe escribo en relación con...`}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        rows={10}
                                        className="font-mono text-sm resize-none"
                                    />
                                </div>
                            </>
                        ) : (
                            /* Podgląd */
                            <div className="space-y-3 rounded-lg border p-4 bg-muted/30">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Asunto del mensaje</p>
                                    <p className="font-medium">{previewSubject || '—'}</p>
                                </div>
                                <hr />
                                <div>
                                    <p className="text-xs text-muted-foreground mb-0.5">Contenido del mensaje</p>
                                    <p className="whitespace-pre-wrap text-sm">
                                        {previewMessage || '—'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Lista odbiorców */}
                        <div className="space-y-1.5">
                            <Label>Destinatarios</Label>
                            <div className="max-h-32 overflow-y-auto rounded-md border divide-y">
                                {recipients.map(r => (
                                    <div
                                        key={r.id}
                                        className="flex items-center justify-between px-3 py-1.5 text-sm"
                                    >
                                        <span className="font-medium">{r.first_name}{" "}{r.last_name}</span>
                                        <span className="text-muted-foreground">{r.email}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Widok wysyłki / wyników --- */}
                {(sendStatus === 'sending' || sendStatus === 'done') && (
                    <div className="space-y-4">
                        {sendStatus === 'done' && (
                            <div className="rounded-lg border p-4 bg-muted/30 text-sm space-y-1">
                                <p className="font-semibold">
                                    {allSent ? '✅ ¡Todos los correos ya se han enviado!' : '⚠️ El envío se ha completado con errores'}
                                </p>
                                <p className="text-muted-foreground">
                                    Enviado: {sentCount} · Errores: {errorCount}
                                </p>
                            </div>
                        )}

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {results.map(r => (
                                <div
                                    key={r.record.id}
                                    className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                                >
                                    <div>
                                        <p className="font-medium">{r.record.first_name}{" "}{r.record.last_name}</p>
                                        <p className="text-muted-foreground text-xs">{r.record.email}</p>
                                        {r.error && (
                                            <p className="text-red-500 text-xs">{r.error}</p>
                                        )}
                                    </div>
                                    <div>
                                        {r.status === 'pending' && (
                                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        )}
                                        {r.status === 'sent' && (
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        )}
                                        {r.status === 'error' && (
                                            <XCircle className="h-4 w-4 text-red-500" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        {sendStatus === 'done' ? 'Cerrar' : 'Cancelar'}
                    </Button>
                    {sendStatus === 'idle' && (
                        <Button
                            onClick={handleSend}
                            disabled={!subject.trim() || !message.trim()}
                            className="gap-2"
                        >
                            <Mail className="h-4 w-4" />
                            Enviar a {recipients.length} personas
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}