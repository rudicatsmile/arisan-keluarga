"use client";

import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Navigation,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  Building,
  User,
  Sparkles,
} from "lucide-react";
import { useArisan } from "@/context/arisan-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function LokasiArisanPage() {
  const { meetings } = useArisan();
  const [activeTab, setActiveTab] = useState("upcoming");

  const plannedMeetings = meetings.filter((m) => m.status === "PLANNED");
  const pastMeetings = meetings.filter((m) => m.status === "DONE");

  const [selectedMeeting, setSelectedMeeting] = useState(plannedMeetings[0] || meetings[0]);

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
  };

  const openWaze = (lat: number, lng: number) => {
    window.open(`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <MapPin className="h-3.5 w-3.5 text-rose-300" />
            <span>Lokasi & Jadwal Pertemuan Paguyuban</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Titik Temu & Histori Arisan
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            Mengetahui lokasi rumah tuan rumah arisan, alamat lengkap, tanggal pelaksanaan, serta petunjuk arah navigasi peta langsung dari ponsel Anda.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming" className="gap-2 text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>Rencana Arisan Mendatang ({plannedMeetings.length})</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 text-xs">
            <History className="h-3.5 w-3.5" />
            <span>Histori Pertemuan Sebelumnya ({pastMeetings.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Upcoming Meetings with Map */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            {/* Left Column: Meeting List */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pilih Jadwal Pertemuan
              </h3>
              {plannedMeetings.map((meet) => {
                const isSelected = selectedMeeting?.id === meet.id;
                return (
                  <Card
                    key={meet.id}
                    onClick={() => setSelectedMeeting(meet)}
                    className={`cursor-pointer transition-all duration-200 border ${
                      isSelected
                        ? "border-blue-500 shadow-md ring-2 ring-blue-500/20 bg-blue-50/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <Badge variant="jadwal" className="text-[10px]">
                          DIJADWALKAN
                        </Badge>
                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          <span>{formatDate(meet.scheduledAt)}</span>
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-base leading-snug">{meet.title}</h4>
                        <p className="text-xs text-blue-700 font-medium mt-1">
                          Tuan Rumah: {meet.hostMemberName}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 flex items-start gap-1.5 line-clamp-2">
                        <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{meet.address}</span>
                      </p>
                    </CardContent>
                  </Card>
                );
              })}

              {plannedMeetings.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                  Tidak ada pertemuan yang sedang dijadwalkan saat ini.
                </div>
              )}
            </div>

            {/* Right Column: Interactive Map & Route Navigation */}
            <div className="lg:col-span-7 space-y-4">
              {selectedMeeting && (
                <Card className="border-slate-200 shadow-sm overflow-hidden bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900">
                          {selectedMeeting.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          Tuan Rumah: <strong>{selectedMeeting.hostMemberName}</strong> • {formatDateTime(selectedMeeting.scheduledAt)} WIB
                        </CardDescription>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs">
                        Titik Koordinat Valid
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 space-y-5">
                    {/* Simulated Interactive Leaflet/OpenStreetMap Visual */}
                    <div className="relative h-72 w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
                      {/* OSM Tile Background Simulator with Map Overlay */}
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage:
                            "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #f8fafc 1px)",
                          backgroundSize: "24px 24px",
                          backgroundPosition: "0 0, 12px 12px",
                        }}
                      />

                      {/* Map Roads & Area Simulator */}
                      <svg className="absolute inset-0 w-full h-full opacity-40">
                        <path d="M0 120 Q 200 80, 400 150 T 800 100" stroke="#94a3b8" strokeWidth="8" fill="none" />
                        <path d="M250 0 Q 300 200, 350 400" stroke="#94a3b8" strokeWidth="6" fill="none" />
                        <circle cx="330" cy="140" r="40" fill="#bfdbfe" opacity="0.4" />
                      </svg>

                      {/* Interactive Pin Marker */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce duration-1000">
                        <div className="rounded-full bg-rose-600 p-2 text-white shadow-xl ring-4 ring-rose-200">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div className="mt-1 px-2.5 py-1 rounded-md bg-slate-900/90 text-white text-[11px] font-bold shadow-md whitespace-nowrap">
                          {selectedMeeting.hostMemberName}
                        </div>
                      </div>

                      {/* Controls Badge */}
                      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Lat: {selectedMeeting.latitude}, Long: {selectedMeeting.longitude}</span>
                      </div>

                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-semibold text-slate-500 border border-slate-200 shadow-xs">
                        OpenStreetMap Tile
                      </div>
                    </div>

                    {/* Address & Description */}
                    <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase">Alamat Lengkap</span>
                        <p className="text-slate-800 font-medium text-sm mt-0.5">{selectedMeeting.address}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px] font-semibold uppercase">Petunjuk Acara & Informasi</span>
                        <p className="text-slate-600 leading-relaxed mt-0.5">{selectedMeeting.notes}</p>
                      </div>
                    </div>

                    {/* Action Navigation Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <Button
                        onClick={() => openGoogleMaps(selectedMeeting.latitude, selectedMeeting.longitude)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-2 font-semibold shadow-xs"
                      >
                        <Navigation className="h-4 w-4" />
                        <span>Buka Rute di Google Maps</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => openWaze(selectedMeeting.latitude, selectedMeeting.longitude)}
                        className="text-xs gap-2 border-slate-300 hover:bg-slate-50"
                      >
                        <ExternalLink className="h-4 w-4 text-blue-600" />
                        <span>Buka via Waze App</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Histori Pertemuan yang telah SELESAI */}
        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {pastMeetings.map((meet) => (
              <Card key={meet.id} className="border-slate-200 shadow-xs bg-white">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="selesai" className="text-[10px]">
                      SELESAI DILAKSANAKAN
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatDate(meet.scheduledAt)}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{meet.title}</h4>

                  <div className="text-xs space-y-1 text-slate-600">
                    <p className="font-medium text-slate-800">
                      Tuan Rumah: <strong>{meet.hostMemberName}</strong>
                    </p>
                    <p className="text-slate-500 leading-relaxed">{meet.address}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 italic">
                    &quot;{meet.notes}&quot;
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono text-[10px]">
                      {meet.latitude}, {meet.longitude}
                    </span>
                    <button
                      type="button"
                      onClick={() => openGoogleMaps(meet.latitude, meet.longitude)}
                      className="text-blue-600 hover:underline font-medium text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>Arsip Lokasi</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
