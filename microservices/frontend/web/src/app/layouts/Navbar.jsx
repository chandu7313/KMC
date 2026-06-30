import { useContext, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { assets } from '@/assets/assets';
import { LanguageContext } from '@/app/providers/LanguageContext';
import { FarmerModeContext } from '@/app/providers/FarmerModeContext';
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalStore } from '@/app/store/globalStore';
import { 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  User, 
  ShoppingBag, 
  Package, 
  Calendar,
  LogIn,
  LayoutDashboard,
  Sprout,
  FlaskConical,
  Wrench,
  Map,
  TreeDeciduous,
  Zap,
  Tractor,
  Landmark
} from "lucide-react";

const Navbar = () => {
  return null;
};

export default Navbar;
