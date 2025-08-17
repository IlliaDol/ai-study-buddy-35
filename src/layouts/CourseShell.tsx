import React from 'react';

type Props = {
  left: React.ReactNode;
  right: React.ReactNode;
  children: React.ReactNode;
  title?: string;
};

export default function CourseShell({ left, right, children, title }: Props) {
  return (
    <div className="min-h-svh">
      <a href="#main" className="sr-only focus:not-sr-only focus:block bg-black/80 text-white p-2">
        Skip to content
      </a>
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">{title ?? 'Course'}</h1>
          <div className="text-sm text-muted-foreground">Full Edition</div>
        </div>
      </header>
      <div className="container grid grid-cols-1 md:grid-cols-12 gap-4 py-4">
        <aside className="md:col-span-3 space-y-4">{left}</aside>
        <main id="main" className="md:col-span-6 space-y-4">{children}</main>
        <aside className="md:col-span-3 space-y-4">{right}</aside>
      </div>
    </div>
  );
}
