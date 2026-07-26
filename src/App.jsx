import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Download, Link2, Search, Home, History, Settings as SettingsIcon, FolderDown,
  Play, Share2, Trash2, Pencil, X, Pause, RotateCw, CheckCircle2, AlertTriangle,
  Music, Film, Sparkles, Loader2, Sun, Moon, Bell, Image as ImageIcon,
  Globe, FileText, Shield, Info, ChevronRight, ChevronLeft, Clipboard, Youtube, Instagram, Facebook,
  Crown, ScanLine, ShieldCheck, Zap, Droplet, Lock, Clock, HardDrive, User, MoreVertical, ArrowRight, Rocket, Radio
} from 'lucide-react';

// ---------- Brand palette ----------
const G_FROM = '#7C3AED';
const G_TO   = '#EC4899';
const INDIGO = '#6366F1';
const VIOLET = '#8B5CF6';
const SOFT   = '#F5F3FF';
const GREEN  = '#22C55E';
const AMBER  = '#F59E0B';
const CORAL  = '#EF4444';
const INK    = '#111827';
const MUTED  = '#6B7280';
const BORDER = '#F1F5F9';

const GRADIENT = `linear-gradient(135deg, ${G_FROM} 0%, ${G_TO} 100%)`;
const GRADIENT_SOFT = `linear-gradient(135deg, ${G_FROM}12 0%, ${G_TO}12 100%)`;