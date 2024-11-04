/**
 * @fileoverview
 * This file contains utility functions that are used throughout the project.
 * These functions are not specific to any component or feature.
 * They are general-purpose functions that can be used anywhere in the project.
 * These functions are exported from this file and can be imported in any file.
 */

// Pagination Interface
interface PaginateResult<T> {
  data: T[];
  next_page: number | null;
  previous_page: number | null;
  total_pages: number;
}

// External dependencies
//
// twMerge and clsx dependencies
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Supabase dependencies
import { createClient } from '@supabase/supabase-js';

// tailwind merge and clsx are used to merge classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const paginate = async <T>(data: T[], table: string, limit: number, offset: number): Promise<PaginateResult<T>> => {
  // Fetch the total number of todos
  const { count } = await supabase
  .from(table)
  .select('*', { count: 'exact', head: true });
  
  const total_pages = count !== null ? Math.ceil(count / limit) : 1;
  const current_page = Math.floor(offset / limit) + 1;
  const next_page = current_page < total_pages ? current_page + 1 : null;
  const previous_page = current_page > 1 ? current_page - 1 : null;

  return {
    data,
    next_page,
    previous_page,
    total_pages,
  };
}
