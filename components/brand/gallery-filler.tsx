'use client';
/* brand-guard */
import { useEffect } from 'react';

const BP = process.env.NEXT_PUBLIC_SANDBOX_BASE_PATH || '';

export default function GalleryFiller() {
  useEffect(() => {
    const fillGroup = (group: HTMLElement[]) => {
      group.forEach((el, i) => {
        el.dataset.brandFilled = '1';
        el.style.backgroundImage = 'linear-gradient(to top, rgba(0,0,0,.6), transparent 55%), url(' + BP + '/gallery-' + ((i % 4) + 1) + '.svg)';
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.color = '#fff';
      });
    };
    const isCard = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return r.height >= 140 && r.width >= 100 && !el.dataset.brandFilled
        && !el.querySelector('img,picture,video,canvas,button,a,input,form,textarea')
        && (el.textContent || '').trim().length <= 40;
    };
    const leafCards = (cands: HTMLElement[]) => cands.filter((el) => !cands.some((o) => o !== el && el.contains(o)));
    const outerCards = (cands: HTMLElement[]) => cands.filter((el) => !cands.some((o) => o !== el && o.contains(el)));
    const bestGroups = (cands: HTMLElement[]) => { const a = groupsOf(outerCards(cands)); return a.length ? a : groupsOf(leafCards(cands)); };
    const groupsOf = (leaves: HTMLElement[]) => {
      const byParent = new Map<Element, HTMLElement[]>();
      leaves.forEach((el) => { const p = el.parentElement; if (p) byParent.set(p, [...(byParent.get(p) || []), el]); });
      return [...byParent.values()].filter((g2) => g2.length >= 2);
    };
    const run = () => {
      // 1) seção cujo título diz galeria/fotos/ambiente: todo cartão sem foto ganha arte (mesmo com gradiente próprio)
      document.querySelectorAll<HTMLElement>('h1,h2,h3').forEach((h) => {
        if (!/galeria|gallery|fotos|ambiente|portf/i.test(h.textContent || '')) return;
        const sec = h.closest('section') || h.parentElement?.parentElement;
        if (!sec) return;
        const cands = [...sec.querySelectorAll<HTMLElement>('*')].filter(isCard);
        bestGroups(cands).forEach(fillGroup);
      });
      // 2) qualquer grade de cartões vazios com ícone (sem foto, sem fundo próprio)
      const loose = [...document.querySelectorAll<HTMLElement>('main *, section *')].filter((el) => isCard(el) && !!el.querySelector('svg') && getComputedStyle(el).backgroundImage === 'none');
      bestGroups(loose).forEach(fillGroup);
    };
    run();
    const t1 = setTimeout(run, 800); const t2 = setTimeout(run, 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return null;
}
