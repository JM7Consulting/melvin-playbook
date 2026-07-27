document.addEventListener('DOMContentLoaded', () => {
    const menuToggleFull = document.getElementById('menuToggleFull');
    const menuToggleMini = document.getElementById('menuToggleMini');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const menuTriggers = document.querySelectorAll('.menu-trigger');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleMenu() {
        if (sidebar) sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('expanded');
    }

    if (menuToggleFull) menuToggleFull.addEventListener('click', toggleMenu);
    if (menuToggleMini) menuToggleMini.addEventListener('click', toggleMenu);

    function openMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('mobile-open');
        sidebar.classList.remove('collapsed');
        if (mainContent) mainContent.classList.remove('expanded');
        if (sidebarOverlay) sidebarOverlay.classList.add('visible');
    }

    function closeMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('mobile-open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('visible');
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('mobile-open')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    menuTriggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
            if (sidebar && sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                if (mainContent) mainContent.classList.remove('expanded');
            }
            const group = trigger.parentElement;
            group.classList.toggle('active');
            const arrow = trigger.querySelector('.arrow');
            if (arrow) arrow.textContent = group.classList.contains('active') ? '▲' : '▼';
        });
    });

    // Busca rápida no menu lateral
    const navSearchInput = document.getElementById('navSearchInput');
    const navSearchEmpty = document.getElementById('navSearchEmpty');
    function normalizeNavText(value) {
        return (value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }
    function resetNavFilter() {
        document.querySelectorAll('.nav-lane').forEach((lane) => lane.classList.remove('is-dimmed'));
        document.querySelectorAll('.menu-group, .menu-standalone').forEach((el) => {
            el.classList.remove('is-filtered-out');
        });
        document.querySelectorAll('.submenu a').forEach((a) => a.classList.remove('is-filter-hit'));
        if (navSearchEmpty) navSearchEmpty.hidden = true;
    }
    function runNavFilter(rawQuery) {
        const query = normalizeNavText(rawQuery);
        if (!query) {
            resetNavFilter();
            return;
        }
        let hits = 0;
        document.querySelectorAll('.nav-lane').forEach((lane) => {
            let laneHits = 0;
            lane.querySelectorAll('.menu-standalone').forEach((item) => {
                const match = normalizeNavText(item.textContent).includes(query);
                item.classList.toggle('is-filtered-out', !match);
                if (match) {
                    laneHits += 1;
                    hits += 1;
                }
            });
            lane.querySelectorAll('.menu-group').forEach((group) => {
                const triggerText = normalizeNavText(group.querySelector('.menu-trigger')?.textContent);
                const links = Array.from(group.querySelectorAll('.submenu a'));
                let groupHit = triggerText.includes(query);
                links.forEach((link) => {
                    const linkHit = normalizeNavText(link.textContent).includes(query);
                    link.classList.toggle('is-filter-hit', linkHit);
                    if (linkHit) groupHit = true;
                });
                group.classList.toggle('is-filtered-out', !groupHit);
                if (groupHit) {
                    laneHits += 1;
                    hits += 1;
                    group.classList.add('active');
                    const arrow = group.querySelector('.menu-trigger .arrow');
                    if (arrow) arrow.textContent = '▲';
                }
            });
            lane.classList.toggle('is-dimmed', laneHits === 0);
        });
        if (navSearchEmpty) navSearchEmpty.hidden = hits > 0;
    }
    if (navSearchInput) {
        navSearchInput.addEventListener('input', () => runNavFilter(navSearchInput.value));
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== navSearchInput && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (sidebar?.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                    if (mainContent) mainContent.classList.remove('expanded');
                }
                navSearchInput.focus();
                navSearchInput.select();
            }
            if (e.key === 'Escape' && document.activeElement === navSearchInput) {
                navSearchInput.value = '';
                resetNavFilter();
                navSearchInput.blur();
            }
        });
    }

    function setupSectionToggle(button, container) {
        if (button && container) {
            button.addEventListener('click', () => {
                if (container.style.display === 'none') {
                    container.style.display = 'block';
                    button.textContent = 'Recolher';
                } else {
                    container.style.display = 'none';
                    button.textContent = 'Expandir';
                }
            });
        }
    }

    setupSectionToggle(document.getElementById('toggleMatrixBtn'), document.getElementById('matrixContainer'));
    setupSectionToggle(document.getElementById('toggleParteABtn'), document.getElementById('parteAContainer'));
    setupSectionToggle(document.getElementById('toggleParteBBtn'), document.getElementById('parteBContainer'));
    setupSectionToggle(document.getElementById('toggleOutFase1Btn'), document.getElementById('outFase1Container'));
    setupSectionToggle(document.getElementById('toggleOutFase2Btn'), document.getElementById('outFase2Container'));
    setupSectionToggle(document.getElementById('toggleOutFase3Btn'), document.getElementById('outFase3Container'));
    setupSectionToggle(document.getElementById('toggleOutConfBtn'), document.getElementById('outConfContainer'));
    setupSectionToggle(document.getElementById('toggleOutCancBtn'), document.getElementById('outCancContainer'));
    setupSectionToggle(document.getElementById('toggleOutNoshowBtn'), document.getElementById('outNoshowContainer'));
    setupSectionToggle(document.getElementById('toggleOutPosBtn'), document.getElementById('outPosContainer'));

    // Cronograma de Trabalho · tabs
    const cronoTabs = document.querySelectorAll('[data-crono-tab]');
    const cronoPanels = document.querySelectorAll('[data-crono-panel]');
    cronoTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const id = tab.getAttribute('data-crono-tab');
            cronoTabs.forEach((t) => {
                t.classList.toggle('is-active', t === tab);
                t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
            });
            cronoPanels.forEach((panel) => {
                const match = panel.getAttribute('data-crono-panel') === id;
                panel.classList.toggle('is-active', match);
                if (match) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
        });
    });

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            localStorage.setItem(
                'theme',
                document.body.classList.contains('light-mode') ? 'light' : 'dark'
            );
        });
    }

    const allSections = document.querySelectorAll('main > section');
    const breadcrumbText = document.getElementById('current-location');

    function expandMenuForHash(hash) {
        const activeMenuLink = document.querySelector(`.nav-container a[href="${hash}"]`);
        if (!activeMenuLink) return;
        const group = activeMenuLink.closest('.menu-group');
        if (!group) return;
        group.classList.add('active');
        const arrow = group.querySelector('.menu-trigger .arrow');
        if (arrow) arrow.textContent = '▲';
    }

    function forceScreenChange(hash) {
        const targetSection = document.querySelector(hash);
        if (!targetSection) return false;

        document.querySelectorAll('.nav-container a').forEach((l) => l.classList.remove('active'));
        const activeMenuLink = document.querySelector(`.nav-container a[href="${hash}"]`);
        if (activeMenuLink) activeMenuLink.classList.add('active');
        expandMenuForHash(hash);

        allSections.forEach((sec) => {
            sec.style.display = 'none';
            sec.classList.remove('page-active');
        });
        targetSection.style.display = 'block';
        targetSection.classList.add('page-active');

        if (breadcrumbText) {
            if (hash === '#home-dashboard') {
                breadcrumbText.innerText = 'Playbook Comercial';
            } else {
                const titleEl = targetSection.querySelector('.cadencia-title-line, h2');
                if (titleEl) {
                    breadcrumbText.innerText = titleEl.textContent.split('•')[0].trim();
                }
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileSidebar();
        if (hash === '#fluxo-comerc-inbound') {
            requestAnimationFrame(() => {
                drawFluxoInboundWires();
                requestAnimationFrame(drawFluxoInboundWires);
            });
        }
        if (hash === '#fluxo-comerc-outbound') {
            requestAnimationFrame(() => {
                drawFluxoOutboundWires();
                requestAnimationFrame(drawFluxoOutboundWires);
            });
        }
        if (hash === '#fluxo-comerc-cs') {
            requestAnimationFrame(() => {
                drawFluxoCsWires();
                requestAnimationFrame(drawFluxoCsWires);
            });
        }
        return true;
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const hash = link.getAttribute('href');
            if (!hash || hash === '#') return;
            if (document.querySelector(hash)) {
                e.preventDefault();
                forceScreenChange(hash);
                history.pushState(null, '', hash);
            }
        });
    });

    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home-dashboard';
        if (!forceScreenChange(hash) && document.getElementById('home-dashboard')) {
            forceScreenChange('#home-dashboard');
        }
    });

    setTimeout(() => {
        if (window.location.hash && document.querySelector(window.location.hash)) {
            forceScreenChange(window.location.hash);
        } else if (document.getElementById('home-dashboard')) {
            forceScreenChange('#home-dashboard');
        }
    }, 50);
});

function toggleLocalBlock(containerId, buttonEl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        buttonEl.textContent = 'Recolher';
    } else {
        container.style.display = 'none';
        buttonEl.textContent = 'Expandir';
    }
}

const FLUXO_INBOUND_EDGES = [
    { from: 'lead', to: 'icp' },
    { from: 'icp', to: 'nao_icp', label: 'NÃO', color: '#f87171', fromSide: 'bottom', toSide: 'top' },
    { from: 'icp', to: 'persona', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'nao_icp', to: 'descartar', color: '#f87171' },
    { from: 'descartar', to: 'nutricao', color: '#94a3b8' },
    { from: 'persona', to: 'contato' },
    { from: 'contato', to: 'cad_contato', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'contato', to: 'mql', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'cad_contato', to: 'outbound', color: '#c084fc', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'mql', to: 'agendou' },
    { from: 'agendou', to: 'cad_agenda', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'agendou', to: 'sql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'cad_agenda', to: 'agendou', color: '#fbbf24', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'sql', to: 'reuniao_q' },
    { from: 'reuniao_q', to: 'noshow', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'reuniao_q', to: 'reuniao_ok', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'left' },
    { from: 'reuniao_ok', to: 'possivel' },
    { from: 'possivel', to: 'followup', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'possivel', to: 'sal', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'sal', to: 'fechou' },
    { from: 'fechou', to: 'followup', label: 'NÃO', color: '#f87171', dashed: true, fromSide: 'left', toSide: 'bottom' },
    { from: 'fechou', to: 'contrato', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'left' },
    { from: 'contrato', to: 'onboarding', color: '#22d3ee' }
];

function fluxoRelRect(el, stage) {
    const sr = stage.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
        left: r.left - sr.left,
        top: r.top - sr.top,
        right: r.right - sr.left,
        bottom: r.bottom - sr.top,
        width: r.width,
        height: r.height,
        cx: r.left - sr.left + r.width / 2,
        cy: r.top - sr.top + r.height / 2
    };
}

function fluxoNodeAnchor(rect, side) {
    if (side === 'top') return { x: rect.cx, y: rect.top };
    if (side === 'bottom') return { x: rect.cx, y: rect.bottom };
    if (side === 'left') return { x: rect.left, y: rect.cy };
    if (side === 'right') return { x: rect.right, y: rect.cy };
    return { x: rect.cx, y: rect.cy };
}

function fluxoGuessSides(aRect, bRect) {
    const dx = bRect.cx - aRect.cx;
    const dy = bRect.cy - aRect.cy;
    if (Math.abs(dx) >= Math.abs(dy)) {
        return dx >= 0 ? ['right', 'left'] : ['left', 'right'];
    }
    return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom'];
}

function fluxoOrthoPath(a, b, fromSide, toSide, opts = {}) {
    const dx = Math.abs(a.x - b.x);
    const dy = Math.abs(a.y - b.y);
    const busX = opts.busX;

    // Quase alinhados → linha reta (evita “degrau” fantasma)
    if (dx < 8) return `M ${b.x} ${a.y} L ${b.x} ${b.y}`;
    if (dy < 8) return `M ${a.x} ${a.y} L ${b.x} ${a.y}`;

    // Barramento vertical compartilhado (ex.: ramos de descarte)
    if (busX != null && fromSide === 'left' && toSide === 'right') {
        return `M ${a.x} ${a.y} L ${busX} ${a.y} L ${busX} ${b.y} L ${b.x} ${b.y}`;
    }
    if (busX != null && fromSide === 'right' && toSide === 'left') {
        return `M ${a.x} ${a.y} L ${busX} ${a.y} L ${busX} ${b.y} L ${b.x} ${b.y}`;
    }

    // Loop same-side (multithreading)
    if (fromSide === 'left' && toSide === 'left') {
        const wing = Math.min(a.x, b.x) - (opts.wing || 36);
        return `M ${a.x} ${a.y} L ${wing} ${a.y} L ${wing} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'right' && toSide === 'right') {
        const wing = Math.max(a.x, b.x) + (opts.wing || 36);
        return `M ${a.x} ${a.y} L ${wing} ${a.y} L ${wing} ${b.y} L ${b.x} ${b.y}`;
    }

    // Cotovelo ortogonal limpo
    if (fromSide === 'right' && toSide === 'left') {
        const midX = (a.x + b.x) / 2;
        return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'left' && toSide === 'right') {
        const midX = (a.x + b.x) / 2;
        return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'bottom' && toSide === 'top') {
        const midY = (a.y + b.y) / 2;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'top' && toSide === 'bottom') {
        const midY = (a.y + b.y) / 2;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if ((fromSide === 'right' || fromSide === 'left') && (toSide === 'top' || toSide === 'bottom')) {
        return `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
    }
    if ((fromSide === 'bottom' || fromSide === 'top') && (toSide === 'left' || toSide === 'right')) {
        return `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'left' && toSide === 'bottom') {
        return `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
    }
    const midY = (a.y + b.y) / 2;
    return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
}

function fluxoLabelPoint(a, b, fromSide) {
    // Sempre colado na saída do losango/caixa (não no meio do caminho longo)
    const dist = 40;
    if (fromSide === 'left') return { x: a.x - dist, y: a.y - 12 };
    if (fromSide === 'right') return { x: a.x + dist, y: a.y - 12 };
    if (fromSide === 'bottom') return { x: a.x + 18, y: a.y + 26 };
    if (fromSide === 'top') return { x: a.x + 18, y: a.y - 18 };
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 8 };
}

function drawFluxoDiagramWires(stageId, svgId, edges, markerPrefix) {
    const stage = document.getElementById(stageId);
    const svg = document.getElementById(svgId);
    if (!stage || !svg) return;
    if (stage.offsetWidth < 40) return;

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.setAttribute('width', w);
    svg.setAttribute('height', h);

    const NS = 'http://www.w3.org/2000/svg';
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const defs = document.createElementNS(NS, 'defs');
    const markerColors = {
        main: '#94a3b8',
        yes: '#34d399',
        no: '#f87171',
        warn: '#fbbf24',
        purple: '#c084fc',
        cyan: '#22d3ee'
    };
    Object.entries(markerColors).forEach(([key, color]) => {
        const marker = document.createElementNS(NS, 'marker');
        marker.setAttribute('id', `${markerPrefix}-${key}`);
        marker.setAttribute('viewBox', '0 0 10 10');
        marker.setAttribute('refX', '8');
        marker.setAttribute('refY', '5');
        marker.setAttribute('markerWidth', '6');
        marker.setAttribute('markerHeight', '6');
        marker.setAttribute('orient', 'auto');
        marker.setAttribute('markerUnits', 'strokeWidth');
        const tip = document.createElementNS(NS, 'path');
        tip.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
        tip.setAttribute('fill', color);
        marker.appendChild(tip);
        defs.appendChild(marker);
    });
    svg.appendChild(defs);

    const nodes = {};
    stage.querySelectorAll('[data-fn]').forEach((el) => {
        nodes[el.getAttribute('data-fn')] = el;
    });

    edges.forEach((edge) => {
        const fromEl = nodes[edge.from];
        const toEl = nodes[edge.to];
        if (!fromEl || !toEl) return;

        const aRect = fluxoRelRect(fromEl, stage);
        const bRect = fluxoRelRect(toEl, stage);

        let fromSide = edge.fromSide;
        let toSide = edge.toSide;
        if (!fromSide || !toSide) {
            [fromSide, toSide] = fluxoGuessSides(aRect, bRect);
        }

        const a = fluxoNodeAnchor(aRect, fromSide);
        const b = fluxoNodeAnchor(bRect, toSide);
        const color = edge.color || '#94a3b8';
        let markerKey = 'main';
        if (color === '#34d399') markerKey = 'yes';
        else if (color === '#f87171') markerKey = 'no';
        else if (color === '#fbbf24') markerKey = 'warn';
        else if (color === '#c084fc') markerKey = 'purple';
        else if (color === '#22d3ee') markerKey = 'cyan';

        const pathOpts = {};
        if (edge.busX != null) pathOpts.busX = edge.busX * w;
        if (edge.wing != null) pathOpts.wing = edge.wing;

        const path = document.createElementNS(NS, 'path');
        path.setAttribute('d', fluxoOrthoPath(a, b, fromSide, toSide, pathOpts));
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color);
        path.setAttribute('stroke-width', edge.dashed ? '1.75' : '2.25');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        if (edge.dashed) path.setAttribute('stroke-dasharray', '6 5');
        path.setAttribute('marker-end', `url(#${markerPrefix}-${markerKey})`);
        path.setAttribute('opacity', edge.dashed ? '0.8' : '0.95');
        svg.appendChild(path);

        if (edge.label) {
            const lp = fluxoLabelPoint(a, b, fromSide);
            const bg = document.createElementNS(NS, 'rect');
            const tw = edge.label.length * 6.2 + 8;
            bg.setAttribute('x', lp.x - tw / 2);
            bg.setAttribute('y', lp.y - 11);
            bg.setAttribute('width', tw);
            bg.setAttribute('height', 14);
            bg.setAttribute('rx', 3);
            bg.setAttribute('fill', 'rgba(15, 23, 42, 0.85)');
            svg.appendChild(bg);

            const label = document.createElementNS(NS, 'text');
            label.setAttribute('x', lp.x);
            label.setAttribute('y', lp.y);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('fill', color);
            label.setAttribute('class', 'wire-label');
            label.textContent = edge.label;
            svg.appendChild(label);
        }
    });
}

function drawFluxoInboundWires() {
    drawFluxoDiagramWires('fluxoInboundStage', 'fluxoInboundWires', FLUXO_INBOUND_EDGES, 'fluxo-in-arrow');
}

const FLUXO_OUTBOUND_EDGES = [
    { from: 'o_mapping', to: 'o_leads', color: '#60a5fa' },
    { from: 'o_leads', to: 'o_icp' },
    { from: 'o_icp', to: 'o_kill_join', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_icp', to: 'o_redflag', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_redflag', to: 'o_kill_join', label: 'SIM', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_kill_join', to: 'o_descartar', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_redflag', to: 'o_persona', label: 'NÃO', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_persona', to: 'o_contato' },
    { from: 'o_contato', to: 'o_cad_contato', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'o_contato', to: 'o_mql', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'o_cad_contato', to: 'o_outra' },
    { from: 'o_outra', to: 'o_persona', label: 'SIM', color: '#c084fc', dashed: true, fromSide: 'left', toSide: 'left', wing: 44 },
    { from: 'o_outra', to: 'o_nutricao', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right', busX: 0.30 },
    { from: 'o_mql', to: 'o_agendou' },
    { from: 'o_agendou', to: 'o_cad_agenda', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'o_agendou', to: 'o_sql', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'o_cad_agenda', to: 'o_agendou', color: '#fbbf24', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'o_sql', to: 'o_reuniao_q' },
    { from: 'o_reuniao_q', to: 'o_noshow', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'o_reuniao_q', to: 'o_reuniao_ok', label: 'SIM', color: '#34d399', fromSide: 'left', toSide: 'right' },
    { from: 'o_reuniao_ok', to: 'o_possivel' },
    { from: 'o_possivel', to: 'o_followup', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'o_possivel', to: 'o_sal', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'o_sal', to: 'o_fechou' },
    { from: 'o_fechou', to: 'o_followup', label: 'NÃO', color: '#f87171', dashed: true, fromSide: 'left', toSide: 'bottom' },
    { from: 'o_fechou', to: 'o_contrato', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'left' },
    { from: 'o_contrato', to: 'o_onboarding', color: '#22d3ee' }
];

function drawFluxoOutboundWires() {
    drawFluxoDiagramWires('fluxoOutboundStage', 'fluxoOutboundWires', FLUXO_OUTBOUND_EDGES, 'fluxo-out-arrow');
}

const FLUXO_CS_EDGES = [
    { from: 'c_map', to: 'c_class', color: '#22d3ee' },
    { from: 'c_class', to: 'c_escopo' },
    { from: 'c_escopo', to: 'c_devolver', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'c_escopo', to: 'c_custom', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'c_custom', to: 'c_esforco', label: 'SIM', color: '#fbbf24', fromSide: 'left', toSide: 'right' },
    { from: 'c_custom', to: 'c_pre', label: 'NÃO', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'c_esforco', to: 'c_pre', color: '#94a3b8', fromSide: 'bottom', toSide: 'left' },
    { from: 'c_pre', to: 'c_lowtouch' },
    { from: 'c_lowtouch', to: 'c_fecha_cs', label: 'SIM', color: '#34d399', fromSide: 'left', toSide: 'top' },
    { from: 'c_lowtouch', to: 'c_warm', label: 'NÃO', color: '#60a5fa', fromSide: 'right', toSide: 'top' },
    { from: 'c_fecha_cs', to: 'c_onb1', color: '#22d3ee' },
    { from: 'c_warm', to: 'c_negocia', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'c_negocia', to: 'c_fechou' },
    { from: 'c_fechou', to: 'c_onb2', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'top' },
    { from: 'c_fechou', to: 'c_churn', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' }
];

function drawFluxoCsWires() {
    drawFluxoDiagramWires('fluxoCsStage', 'fluxoCsWires', FLUXO_CS_EDGES, 'fluxo-cs-arrow');
}

function refreshActiveFluxoWires() {
    if (document.getElementById('fluxo-comerc-inbound')?.classList.contains('page-active')) {
        drawFluxoInboundWires();
    }
    if (document.getElementById('fluxo-comerc-outbound')?.classList.contains('page-active')) {
        drawFluxoOutboundWires();
    }
    if (document.getElementById('fluxo-comerc-cs')?.classList.contains('page-active')) {
        drawFluxoCsWires();
    }
}

window.addEventListener('resize', refreshActiveFluxoWires);

(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(refreshActiveFluxoWires);
    ['fluxoInboundStage', 'fluxoOutboundStage', 'fluxoCsStage'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) ro.observe(el);
    });
})();

/* Objeções kit: busca + filtros por página */
function initObjKit(root) {
    if (!root) return;
    const search = root.querySelector('.obj-search');
    const filters = root.querySelectorAll('.obj-filter');
    const cards = root.querySelectorAll('.obj-card');
    const empty = root.querySelector('.obj-empty');
    let activeFilter = 'all';

    function apply() {
        const q = (search?.value || '').trim().toLowerCase();
        let visible = 0;
        cards.forEach((card) => {
            const type = card.getAttribute('data-obj-type') || '';
            const hay = (card.getAttribute('data-obj-text') || card.textContent || '').toLowerCase();
            const typeOk = activeFilter === 'all' || type === activeFilter;
            const textOk = !q || hay.includes(q);
            const show = typeOk && textOk;
            card.classList.toggle('is-hidden', !show);
            if (show) visible += 1;
        });
        if (empty) empty.hidden = visible > 0;
    }

    filters.forEach((btn) => {
        btn.addEventListener('click', () => {
            filters.forEach((b) => b.classList.remove('is-active'));
            btn.classList.add('is-active');
            activeFilter = btn.getAttribute('data-filter') || 'all';
            apply();
        });
    });
    if (search) {
        search.addEventListener('input', apply);
    }
}

document.querySelectorAll('.obj-kit-page').forEach(initObjKit);
