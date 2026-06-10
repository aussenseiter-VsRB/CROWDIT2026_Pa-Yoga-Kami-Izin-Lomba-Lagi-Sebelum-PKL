import { asset } from '../utils/url.js';
import { DATA_PATHS, SEARCH_SCORES, LIMITS } from '../core/config.js';
import { normalizeCategory } from '../../features/home/js/_utils.js';

class SearchEngine {
  constructor() {
    this.index = [];
    this.ready = false;
  }

  tokenize(text) {
    return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  }

  ngrams(word, min = 2, max = 4) {
    const set = new Set();
    for (let n = min; n <= max; n++) {
      for (let i = 0; i <= word.length - n; i++) {
        set.add(word.substring(i, i + n));
      }
    }
    return set;
  }

  async init() {
    if (this.ready) return;

    const [groups, detail] = await Promise.all([
      fetch(asset(DATA_PATHS.GROUPS)).then(r => r.json()),
      fetch(asset(DATA_PATHS.DETAIL)).then(r => r.json()),
    ]);

    const docs = [];

    (Array.isArray(detail) ? detail : []).forEach((d, i) => {
      if (d.course) {
        docs.push({
          type: 'Forum',
          title: d.course.title,
          description: d.course.description,
          url: `/groups?index=${i}`,
          tags: [d.course.status].filter(Boolean),
          category: d.course.category,
        });
      }
    });

    (groups.groups || []).forEach((g, i) => {
      docs.push({
        type: 'Grup',
        title: g.title,
        description: g.description,
        url: `/groups?group=${i}`,
        tags: [g.department],
        category: g.department,
        meta: `${g.members}/${g.maxMembers} anggota`,
      });
    });

    (Array.isArray(detail) ? detail : []).forEach((d, i) => {
      if (d.course) {
        docs.push({
          type: 'Kursus',
          title: d.course.title,
          description: d.course.description,
          url: `/detail?index=${i}`,
          tags: [d.course.category, d.course.status].filter(Boolean),
          category: d.course.category,
          meta: `${d.participants?.joined || 0}/${d.participants?.capacity || 0} peserta`,
        });
      }
    });

    docs.forEach(doc => {
      doc.category = normalizeCategory(doc.category);
      const raw = `${doc.title} ${doc.description} ${doc.tags.join(' ')} ${doc.category}`.toLowerCase();
      const terms = this.tokenize(raw);
      const ngramSet = new Set();
      terms.forEach(t => {
        this.ngrams(t).forEach(n => ngramSet.add(n));
      });

      doc._search = { raw, terms, ngrams: ngramSet };
    });

    this.index = docs;
    this.ready = true;
  }

  search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const qTerms = this.tokenize(q).filter(t => t.length >= 2);
    if (qTerms.length === 0) return [];
    const qNgrams = new Set();
    qTerms.forEach(t => this.ngrams(t).forEach(n => qNgrams.add(n)));

    const MIN_SCORE = SEARCH_SCORES.MIN_SCORE;

    const scored = this.index.map(doc => {
      let score = 0;
      let directMatch = false;
      const qtMatched = new Set();
      const { raw, terms, ngrams } = doc._search;

      const titleLower = doc.title.toLowerCase();
      const descLower = doc.description.toLowerCase();

      qTerms.forEach(qt => {
        let hit = false;
        if (titleLower === qt) { score += SEARCH_SCORES.EXACT_TITLE_MATCH; hit = true; }
        else if (titleLower.startsWith(qt) || titleLower.includes(` ${qt}`)) { score += SEARCH_SCORES.TITLE_PREFIX_MATCH; hit = true; }
        else if (titleLower.includes(qt)) { score += SEARCH_SCORES.TITLE_SUBSTRING_MATCH; hit = true; }

        if (descLower.includes(qt)) { score += SEARCH_SCORES.DESCRIPTION_MATCH; hit = true; }

        if (doc.tags.some(t => t.toLowerCase().includes(qt))) { score += SEARCH_SCORES.TAG_MATCH; hit = true; }
        if (doc.category.toLowerCase().includes(qt)) { score += SEARCH_SCORES.CATEGORY_MATCH; hit = true; }

        if (hit) {
          directMatch = true;
          qtMatched.add(qt);
        }
      });

      if (directMatch && qTerms.every(qt => terms.some(t => t.startsWith(qt) || t.includes(qt)))) {
        score += SEARCH_SCORES.ALL_TERMS_BONUS;
      }

      if (directMatch) {
        const overlap = [...ngrams].filter(n => qNgrams.has(n)).length;
        if (overlap > 0) {
          const maxLen = Math.max(ngrams.size, qNgrams.size);
          score += (overlap / maxLen) * SEARCH_SCORES.NGRAM_OVERLAP_MULTIPLIER;
        }
      }

      const coverage = qtMatched.size / qTerms.length;
      score = score * coverage;

      return { ...doc, score };
    });

    return scored
      .filter(d => d.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, LIMITS.MAX_SEARCH_RESULTS);
  }
}

export const searchEngine = new SearchEngine();
