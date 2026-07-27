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
        const targetEl = document.querySelector(hash);
        if (!targetEl) return false;

        // Anchors inside a page (ex.: #obj-out-01) must keep the parent section visible
        const targetSection = targetEl.matches('main > section')
            ? targetEl
            : targetEl.closest('main > section');
        if (!targetSection) return false;

        const pageHash = targetSection.id ? `#${targetSection.id}` : hash;

        document.querySelectorAll('.nav-container a').forEach((l) => l.classList.remove('active'));
        const activeMenuLink =
            document.querySelector(`.nav-container a[href="${pageHash}"]`) ||
            document.querySelector(`.nav-container a[href="${hash}"]`);
        if (activeMenuLink) activeMenuLink.classList.add('active');
        expandMenuForHash(pageHash);

        allSections.forEach((sec) => {
            sec.style.display = 'none';
            sec.classList.remove('page-active');
        });
        targetSection.style.display = 'block';
        targetSection.classList.add('page-active');

        if (breadcrumbText) {
            if (pageHash === '#home-dashboard') {
                breadcrumbText.innerText = 'Playbook Comercial';
            } else {
                const titleEl = targetSection.querySelector('.cadencia-title-line, h2');
                if (titleEl) {
                    breadcrumbText.innerText = titleEl.textContent.split('•')[0].trim();
                }
            }
        }

        if (targetEl !== targetSection) {
            requestAnimationFrame(() => {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                targetEl.classList.add('is-jump-target');
                setTimeout(() => targetEl.classList.remove('is-jump-target'), 1400);
            });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        closeMobileSidebar();
        if (pageHash === '#fluxo-comerc-cs') {
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

/* Edges espelham o PDF "Fluxo Comercial INBOUND" (draw.io p.2) — sem inventar ramos */
const FLUXO_INBOUND_EDGES = [
    { from: 'lead', to: 'icp' },
    { from: 'icp', to: 'cad_contato', label: 'SIM', color: '#34d399', fromSide: 'right', toSide: 'left' },
    { from: 'icp', to: 'persona_mkt', label: 'NÃO', color: '#f87171', fromSide: 'bottom', toSide: 'top' },
    { from: 'persona_mkt', to: 'descarte', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'top' },
    { from: 'persona_mkt', to: 'nutricao', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    { from: 'cad_contato', to: 'contato' },
    { from: 'contato', to: 'outbound', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'contato', to: 'icp_sdr', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'icp_sdr', to: 'descarte', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'icp_sdr', to: 'persona_sdr', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'persona_sdr', to: 'outbound', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'persona_sdr', to: 'mql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    { from: 'mql', to: 'agendou' },
    { from: 'agendou', to: 'sql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'agendou', to: 'cad_agenda', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'top' },
    { from: 'cad_agenda', to: 'agendou', color: '#fbbf24', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'cad_agenda', to: 'conn_a', color: '#94a3b8', fromSide: 'bottom', toSide: 'top' },
    { from: 'conn_a', to: 'conn_a2', color: '#c084fc', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'conn_a2', to: 'outbound', color: '#c084fc', fromSide: 'bottom', toSide: 'top' },

    { from: 'sql', to: 'reuniao_q', fromSide: 'right', toSide: 'left' },
    { from: 'reuniao_q', to: 'reagendamento', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'reuniao_q', to: 'possivel', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'reagendamento', to: 'agendou', color: '#fbbf24', dashed: true, fromSide: 'bottom', toSide: 'left' },

    { from: 'possivel', to: 'outbound', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'possivel', to: 'sal', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'sal', to: 'followup' },
    { from: 'followup', to: 'fechou' },
    { from: 'fechou', to: 'nutricao', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'fechou', to: 'contrato', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'contrato', to: 'onboarding', color: '#22d3ee', fromSide: 'left', toSide: 'right' },
    { from: 'fluxo_cs', to: 'sql', color: '#22d3ee', fromSide: 'top', toSide: 'bottom' },
    { from: 'fluxo_cs', to: 'nutricao', color: '#94a3b8', dashed: true, fromSide: 'left', toSide: 'right' }
];

function fluxoRelRect(el, stage) {
    // Layout offsets (ignore CSS transform:scale on zoom ancestors) so wires stay aligned.
    let x = 0;
    let y = 0;
    let node = el;
    while (node && node !== stage) {
        x += node.offsetLeft;
        y += node.offsetTop;
        const parent = node.offsetParent;
        if (!parent || (parent !== stage && !stage.contains(parent))) {
            const sr = stage.getBoundingClientRect();
            const r = el.getBoundingClientRect();
            const scale = sr.width / Math.max(stage.clientWidth, 1);
            return {
                left: (r.left - sr.left) / scale,
                top: (r.top - sr.top) / scale,
                width: r.width / scale,
                height: r.height / scale,
                right: (r.right - sr.left) / scale,
                bottom: (r.bottom - sr.top) / scale,
                cx: (r.left - sr.left + r.width / 2) / scale,
                cy: (r.top - sr.top + r.height / 2) / scale
            };
        }
        node = parent;
    }
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    // .fn uses translate(-50%, 0): layout left is the visual center X
    const cx = x;
    const cy = y + height / 2;
    return {
        left: cx - width / 2,
        top: y,
        right: cx + width / 2,
        bottom: y + height,
        width,
        height,
        cx,
        cy
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
    // Sobe/desce primeiro, depois horizontal (evita atravessar a espinha)
    if (fromSide === 'right' && toSide === 'bottom') {
        const midY = b.y;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'bottom' && toSide === 'right') {
        const midY = (a.y + b.y) / 2;
        return `M ${a.x} ${a.y} L ${a.x} ${midY} L ${b.x} ${midY} L ${b.x} ${b.y}`;
    }
    if (fromSide === 'left' && toSide === 'bottom') {
        const wing = Math.min(a.x, b.x) - (opts.wing || 28);
        return `M ${a.x} ${a.y} L ${wing} ${a.y} L ${wing} ${b.y} L ${b.x} ${b.y}`;
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
        path.setAttribute('data-edge-from', edge.from);
        path.setAttribute('data-edge-to', edge.to);
        svg.appendChild(path);

        if (edge.label) {
            const lp = fluxoLabelPoint(a, b, fromSide);
            const group = document.createElementNS(NS, 'g');
            group.setAttribute('class', 'wire-label-group');
            group.setAttribute('data-edge-from', edge.from);
            group.setAttribute('data-edge-to', edge.to);

            const bg = document.createElementNS(NS, 'rect');
            const tw = edge.label.length * 6.2 + 8;
            bg.setAttribute('x', lp.x - tw / 2);
            bg.setAttribute('y', lp.y - 11);
            bg.setAttribute('width', tw);
            bg.setAttribute('height', 14);
            bg.setAttribute('rx', 3);
            bg.setAttribute('fill', 'rgba(15, 23, 42, 0.85)');
            group.appendChild(bg);

            const label = document.createElementNS(NS, 'text');
            label.setAttribute('x', lp.x);
            label.setAttribute('y', lp.y);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('dominant-baseline', 'middle');
            label.setAttribute('fill', color);
            label.setAttribute('class', 'wire-label');
            label.textContent = edge.label;
            group.appendChild(label);
            svg.appendChild(group);
        }
    });
}

function drawFluxoInboundWires() {
    drawFluxoDiagramWires('fluxoInboundStage', 'fluxoInboundWires', FLUXO_INBOUND_EDGES, 'fluxo-in-arrow');
}

const FLUXO_OUTBOUND_EDGES = [
    /* A → Leads (horizontal limpo) */
    { from: 'o_a', to: 'o_leads', color: '#c084fc', fromSide: 'right', toSide: 'left' },
    { from: 'o_leads', to: 'o_icp1' },

    /* É ICP? — SIM desce · NÃO vai à direita para Existe outra pessoa? */
    { from: 'o_icp1', to: 'o_encontrou', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_icp1', to: 'o_outra', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },

    /* Existe outra pessoa? — SIM volta p/ Encontrou · NÃO → C1 (Marketing) */
    { from: 'o_outra', to: 'o_encontrou', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'right' },
    { from: 'o_outra', to: 'o_c1', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },

    /* Encontrou Persona? */
    { from: 'o_encontrou', to: 'o_cad_contato', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_encontrou', to: 'o_outra', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'bottom' },

    /* CS → B → entra na Cadência de Contato pela esquerda */
    { from: 'o_fluxo_cs', to: 'o_b', color: '#22d3ee', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_b', to: 'o_cad_contato', color: '#22d3ee', fromSide: 'right', toSide: 'left' },

    /* Conseguiu contato? — NÃO → C2 local · SIM desce */
    { from: 'o_cad_contato', to: 'o_contato' },
    { from: 'o_contato', to: 'o_c2', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_contato', to: 'o_icp2', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* É ICP? pós-contato — NÃO → Descarte (esquerda) */
    { from: 'o_icp2', to: 'o_descarte', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_icp2', to: 'o_persona', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* É Persona? — NÃO → C3 local */
    { from: 'o_persona', to: 'o_c3', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_persona', to: 'o_mql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* MQL → Red flag? — SIM sobe p/ Descarte · NÃO desce */
    { from: 'o_mql', to: 'o_redflag' },
    { from: 'o_redflag', to: 'o_descarte', label: 'SIM', color: '#f87171', fromSide: 'left', toSide: 'bottom' },
    { from: 'o_redflag', to: 'o_agendou', label: 'NÃO', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* Agendou? — NÃO → cadência (esquerda) · SIM → SQL */
    { from: 'o_agendou', to: 'o_sql', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_agendou', to: 'o_cad_agenda', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_cad_agenda', to: 'o_agendou', color: '#fbbf24', dashed: true, fromSide: 'right', toSide: 'left' },
    { from: 'o_cad_agenda', to: 'o_c_agenda', color: '#94a3b8', fromSide: 'bottom', toSide: 'top' },

    /* SQL → Closer (mesma altura) */
    { from: 'o_sql', to: 'o_reuniao_q', fromSide: 'right', toSide: 'left' },
    /* NÃO sobe p/ Reagendamento (direita do Agendou) · volta ao Agendou */
    { from: 'o_reuniao_q', to: 'o_reagendamento', label: 'NÃO', color: '#f87171', fromSide: 'left', toSide: 'right' },
    { from: 'o_reagendamento', to: 'o_agendou', color: '#fbbf24', dashed: true, fromSide: 'left', toSide: 'right' },
    { from: 'o_reuniao_q', to: 'o_possivel', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },

    /* Possível fechamento? — NÃO → C4 local */
    { from: 'o_possivel', to: 'o_c4', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_possivel', to: 'o_sal', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_sal', to: 'o_followup' },
    { from: 'o_followup', to: 'o_fechou' },

    /* Fechou? — NÃO → C5 local · SIM → Contrato → Onboarding */
    { from: 'o_fechou', to: 'o_c5', label: 'NÃO', color: '#f87171', fromSide: 'right', toSide: 'left' },
    { from: 'o_fechou', to: 'o_contrato', label: 'SIM', color: '#34d399', fromSide: 'bottom', toSide: 'top' },
    { from: 'o_contrato', to: 'o_onboarding', color: '#22d3ee', fromSide: 'left', toSide: 'right' },

    /* Só o C do topo liga visualmente à nutrição (demais C = mesmo conector no PDF) */
    { from: 'o_c1', to: 'o_nutricao', color: '#94a3b8' }
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
    if (document.getElementById('fluxo-comerc-cs')?.classList.contains('page-active')) {
        drawFluxoCsWires();
    }
}

window.addEventListener('resize', refreshActiveFluxoWires);

(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(refreshActiveFluxoWires);
    const el = document.getElementById('fluxoCsStage');
    if (el) ro.observe(el);
})();

/* Fluxo boards SVG (CS): zoom/pan/highlight */
function initFluxoBoardUX(cfg) {
    const viewport = document.getElementById(cfg.viewportId);
    const zoomLayer = document.getElementById(cfg.zoomId);
    const board = document.getElementById(cfg.boardId);
    const stage = document.getElementById(cfg.stageId);
    const toolbar = document.getElementById(cfg.toolbarId);
    const strip = document.getElementById(cfg.stripId);
    const stripText = document.getElementById(cfg.stripTextId);
    const edges = cfg.edges;
    const draw = cfg.draw;
    const svgId = cfg.svgId;
    if (!viewport || !zoomLayer || !board || !stage) return;

    let zoom = 1;

    function applyZoom() {
        zoomLayer.style.transform = `scale(${zoom})`;
        const w = board.offsetWidth;
        const h = board.offsetHeight;
        zoomLayer.style.marginRight = `${Math.max(0, w * (zoom - 1))}px`;
        zoomLayer.style.marginBottom = `${Math.max(0, h * (zoom - 1))}px`;
        const resetBtn = toolbar?.querySelector('[data-fluxo-zoom="reset"]');
        if (resetBtn) resetBtn.textContent = `${Math.round(zoom * 100)}%`;
        requestAnimationFrame(() => {
            draw();
            requestAnimationFrame(draw);
        });
    }

    toolbar?.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-fluxo-zoom], [data-fluxo-fit], [data-fluxo-clear]');
        if (!btn) return;
        if (btn.hasAttribute('data-fluxo-clear')) {
            clearFocus();
            return;
        }
        if (btn.hasAttribute('data-fluxo-fit')) {
            zoom = 1;
            applyZoom();
            viewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            return;
        }
        const mode = btn.getAttribute('data-fluxo-zoom');
        if (mode === 'in') zoom = Math.min(1.55, +(zoom + 0.1).toFixed(2));
        if (mode === 'out') zoom = Math.max(0.55, +(zoom - 0.1).toFixed(2));
        if (mode === 'reset') zoom = 1;
        applyZoom();
    });

    let panning = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.fn') || e.target.closest('.fluxo-tool')) return;
        panning = true;
        viewport.classList.add('is-panning');
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = viewport.scrollLeft;
        scrollTop = viewport.scrollTop;
        viewport.setPointerCapture?.(e.pointerId);
    });
    viewport.addEventListener('pointermove', (e) => {
        if (!panning) return;
        viewport.scrollLeft = scrollLeft - (e.clientX - startX);
        viewport.scrollTop = scrollTop - (e.clientY - startY);
    });
    const endPan = () => {
        panning = false;
        viewport.classList.remove('is-panning');
    };
    viewport.addEventListener('pointerup', endPan);
    viewport.addEventListener('pointercancel', endPan);

    function nodeLabel(id) {
        const el = stage.querySelector(`[data-fn="${id}"]`);
        if (!el) return id;
        if (el.classList.contains('fn-diamond')) return el.getAttribute('data-label') || id;
        return (el.textContent || id).replace(/\s+/g, ' ').trim();
    }

    function neighbors(id) {
        const outs = edges.filter((e) => e.from === id).map((e) => e.to);
        const ins = edges.filter((e) => e.to === id).map((e) => e.from);
        return [...new Set([...outs, ...ins])];
    }

    function clearFocus() {
        stage.classList.remove('is-focus');
        stage.querySelectorAll('.is-hot').forEach((n) => n.classList.remove('is-hot'));
        if (strip) strip.hidden = true;
    }

    function focusNode(id) {
        const hot = new Set([id, ...neighbors(id)]);
        stage.classList.add('is-focus');
        stage.querySelectorAll('.fn[data-fn]').forEach((el) => {
            el.classList.toggle('is-hot', hot.has(el.getAttribute('data-fn')));
        });
        const svg = document.getElementById(svgId);
        svg?.querySelectorAll('path[data-edge-from], .wire-label-group').forEach((el) => {
            const a = el.getAttribute('data-edge-from');
            const b = el.getAttribute('data-edge-to');
            const on = hot.has(a) && hot.has(b) && (a === id || b === id);
            el.classList.toggle('is-hot', on);
        });
        if (strip && stripText) {
            const outs = edges.filter((e) => e.from === id)
                .map((e) => `${e.label ? e.label + ' → ' : ''}${nodeLabel(e.to)}`)
                .join(' · ');
            stripText.textContent = `${nodeLabel(id)}${outs ? ' — ' + outs : ''}`;
            strip.hidden = false;
        }
    }

    stage.addEventListener('click', (e) => {
        const node = e.target.closest('.fn[data-fn]');
        if (!node) {
            clearFocus();
            return;
        }
        focusNode(node.getAttribute('data-fn'));
    });

    strip?.querySelector('[data-fluxo-clear]')?.addEventListener('click', clearFocus);
    applyZoom();
}

/* PDF diagram boards: zoom/pan + click path highlight */
function initFluxoPdfUX(cfg) {
    const viewport = document.getElementById(cfg.viewportId);
    const zoomLayer = document.getElementById(cfg.zoomId);
    const stage = document.getElementById(cfg.stageId);
    const img = document.getElementById(cfg.imgId);
    const hotsBox = document.getElementById(cfg.hotsId);
    const svg = document.getElementById(cfg.svgId);
    const toolbar = document.getElementById(cfg.toolbarId);
    const strip = document.getElementById(cfg.stripId);
    const stripText = document.getElementById(cfg.stripTextId);
    if (!viewport || !zoomLayer || !img || !hotsBox || !svg || !stage) return;

    const sources = cfg.sources || {};
    const hotsByVer = cfg.hots || {};
    const edgesByVer = cfg.edges || {};
    let zoom = 1;
    let pdfVer = cfg.defaultVer || 'v2';
    let activeId = null;
    const HIT_RADIUS = 9;

    function currentHots() {
        return hotsByVer[pdfVer] || hotsByVer.v2 || [];
    }
    function currentEdges() {
        return edgesByVer[pdfVer] || edgesByVer.v2 || [];
    }
    function byIdMap() {
        return Object.fromEntries(currentHots().map((h) => [h.id, h]));
    }

    function buildHots() {
        hotsBox.innerHTML = '';
        currentHots().forEach((h) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'fluxo-pdf-hot';
            btn.dataset.fn = h.id;
            btn.title = h.label;
            btn.setAttribute('aria-label', h.label);
            btn.style.left = `${h.x}%`;
            btn.style.top = `${h.y}%`;
            hotsBox.appendChild(btn);
        });
    }

    function applyZoom() {
        zoomLayer.style.transform = `scale(${zoom})`;
        const w = stage.offsetWidth || img.offsetWidth || 1100;
        const h = stage.offsetHeight || img.offsetHeight || 1500;
        zoomLayer.style.marginRight = `${Math.max(0, w * (zoom - 1))}px`;
        zoomLayer.style.marginBottom = `${Math.max(0, h * (zoom - 1))}px`;
        const resetBtn = toolbar?.querySelector('[data-fluxo-zoom="reset"]');
        if (resetBtn) resetBtn.textContent = `${Math.round(zoom * 100)}%`;
        syncSvgSize();
    }

    function syncSvgSize() {
        const w = stage.clientWidth;
        const h = stage.clientHeight;
        if (w < 10 || h < 10) return;
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('width', String(w));
        svg.setAttribute('height', String(h));
    }

    function clearFocus() {
        activeId = null;
        stage.classList.remove('is-focus');
        hotsBox.querySelectorAll('.is-hot').forEach((n) => n.classList.remove('is-hot'));
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        if (strip) strip.hidden = true;
    }

    function neighbors(id) {
        const edges = currentEdges();
        const outs = edges.filter((e) => e.from === id).map((e) => e.to);
        const ins = edges.filter((e) => e.to === id).map((e) => e.from);
        return [...new Set([...outs, ...ins])];
    }

    function pctToXY(h) {
        return {
            x: (h.x / 100) * stage.clientWidth,
            y: (h.y / 100) * stage.clientHeight
        };
    }

    function nearestHot(pctX, pctY) {
        let best = null;
        let bestDist = Infinity;
        currentHots().forEach((h) => {
            const d = Math.hypot(h.x - pctX, h.y - pctY);
            if (d < bestDist) {
                bestDist = d;
                best = h;
            }
        });
        return bestDist <= HIT_RADIUS ? best : null;
    }

    function focusNode(id) {
        if (!(hotsByVer[pdfVer] || []).length) return;
        activeId = id;
        const byId = byIdMap();
        const hot = new Set([id, ...neighbors(id)]);
        stage.classList.add('is-focus');
        hotsBox.querySelectorAll('.fluxo-pdf-hot').forEach((el) => {
            el.classList.toggle('is-hot', hot.has(el.dataset.fn));
        });

        syncSvgSize();
        while (svg.firstChild) svg.removeChild(svg.firstChild);
        const NS = 'http://www.w3.org/2000/svg';
        currentEdges().forEach((edge) => {
            if (!(hot.has(edge.from) && hot.has(edge.to) && (edge.from === id || edge.to === id))) return;
            const a = byId[edge.from];
            const b = byId[edge.to];
            if (!a || !b) return;
            const p1 = pctToXY(a);
            const p2 = pctToXY(b);
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const path = document.createElementNS(NS, 'path');
            const d = Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)
                ? `M ${p1.x} ${p1.y} L ${midX} ${p1.y} L ${midX} ${p2.y} L ${p2.x} ${p2.y}`
                : `M ${p1.x} ${p1.y} L ${p1.x} ${midY} L ${p2.x} ${midY} L ${p2.x} ${p2.y}`;
            path.setAttribute('d', d);
            svg.appendChild(path);
        });

        if (strip && stripText) {
            const outs = currentEdges().filter((e) => e.from === id)
                .map((e) => `${e.label ? e.label + ' → ' : ''}${byId[e.to]?.label || e.to}`)
                .join(' · ');
            stripText.textContent = `${byId[id]?.label || id}${outs ? ' — ' + outs : ''}`;
            strip.hidden = false;
        }
    }

    function hitFromEvent(e) {
        const rect = stage.getBoundingClientRect();
        if (rect.width < 10 || rect.height < 10) return null;
        const pctX = ((e.clientX - rect.left) / rect.width) * 100;
        const pctY = ((e.clientY - rect.top) / rect.height) * 100;
        return nearestHot(pctX, pctY);
    }

    buildHots();
    stage.dataset.pdfVer = pdfVer;

    toolbar?.addEventListener('click', (e) => {
        const clearBtn = e.target.closest('[data-fluxo-clear]');
        if (clearBtn) {
            clearFocus();
            return;
        }
        const pdfBtn = e.target.closest('[data-fluxo-pdf]');
        if (pdfBtn) {
            const key = pdfBtn.getAttribute('data-fluxo-pdf');
            if (sources[key]) {
                pdfVer = key;
                stage.dataset.pdfVer = key;
                img.src = sources[key];
                toolbar.querySelectorAll('[data-fluxo-pdf]').forEach((b) => b.classList.toggle('is-active', b === pdfBtn));
                clearFocus();
                buildHots();
                zoom = 1;
                img.onload = applyZoom;
            }
            return;
        }
        const btn = e.target.closest('[data-fluxo-zoom], [data-fluxo-fit]');
        if (!btn) return;
        if (btn.hasAttribute('data-fluxo-fit')) {
            zoom = 1;
            applyZoom();
            viewport.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
            return;
        }
        const mode = btn.getAttribute('data-fluxo-zoom');
        if (mode === 'in') zoom = Math.min(2.2, +(zoom + 0.15).toFixed(2));
        if (mode === 'out') zoom = Math.max(0.4, +(zoom - 0.15).toFixed(2));
        if (mode === 'reset') zoom = 1;
        applyZoom();
        if (activeId && stage.classList.contains('is-focus')) focusNode(activeId);
    });

    strip?.querySelector('[data-fluxo-clear]')?.addEventListener('click', clearFocus);

    let panning = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let scrollLeft = 0;
    let scrollTop = 0;
    let ignoreClick = false;

    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.fluxo-tool')) return;
        if (e.target.closest('.fluxo-pdf-hot')) {
            // hotspot handles its own click; don't pan
            ignoreClick = false;
            moved = false;
            return;
        }
        panning = true;
        moved = false;
        ignoreClick = false;
        viewport.classList.add('is-panning');
        startX = e.clientX;
        startY = e.clientY;
        scrollLeft = viewport.scrollLeft;
        scrollTop = viewport.scrollTop;
    });
    viewport.addEventListener('pointermove', (e) => {
        if (!panning) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        viewport.scrollLeft = scrollLeft - dx;
        viewport.scrollTop = scrollTop - dy;
    });
    viewport.addEventListener('pointerup', (e) => {
        const wasPanning = panning;
        const wasMoved = moved;
        panning = false;
        viewport.classList.remove('is-panning');
        if (!wasPanning || wasMoved) return;
        if (e.target.closest('.fluxo-tool') || e.target.closest('.fluxo-pdf-hot')) return;
        if (!(hotsByVer[pdfVer] || []).length) return;
        const hit = hitFromEvent(e);
        ignoreClick = true;
        if (!hit) clearFocus();
        else focusNode(hit.id);
    });
    viewport.addEventListener('pointercancel', () => {
        panning = false;
        viewport.classList.remove('is-panning');
    });

    hotsBox.addEventListener('click', (e) => {
        const hot = e.target.closest('.fluxo-pdf-hot');
        if (!hot) return;
        e.preventDefault();
        e.stopPropagation();
        focusNode(hot.dataset.fn);
    });

    stage.addEventListener('click', (e) => {
        if (ignoreClick) {
            ignoreClick = false;
            return;
        }
        if (moved) return;
        if (e.target.closest('.fluxo-pdf-hot')) return;
        if (!(hotsByVer[pdfVer] || []).length) return;
        const hit = hitFromEvent(e);
        if (!hit) clearFocus();
        else focusNode(hit.id);
    });

    if (img.complete) applyZoom();
    else img.addEventListener('load', applyZoom);
    window.addEventListener('resize', () => {
        applyZoom();
        if (activeId && stage.classList.contains('is-focus')) focusNode(activeId);
    });
}

const FLUXO_INBOUND_PDF_HOTS = [
    { id: 'lead', label: 'Lead inbound', x: 12.5, y: 12.2 },
    { id: 'icp', label: 'É ICP?', x: 12.5, y: 18.8 },
    { id: 'cad_contato', label: 'Cadência de tentativas de contato', x: 42.0, y: 12.2 },
    { id: 'conn_a2', label: 'A', x: 87.5, y: 15.2 },
    { id: 'outbound', label: 'Fluxo outbound', x: 87.5, y: 21.8 },
    { id: 'persona_mkt', label: 'É Persona?', x: 12.5, y: 27.5 },
    { id: 'contato', label: 'Conseguiu contato?', x: 42.0, y: 21.5 },
    { id: 'descarte', label: 'Descarte', x: 12.5, y: 36.0 },
    { id: 'icp_sdr', label: 'É ICP?', x: 42.0, y: 30.0 },
    { id: 'persona_sdr', label: 'É Persona?', x: 42.0, y: 38.2 },
    { id: 'mql', label: 'MQL - SDR', x: 42.0, y: 46.2 },
    { id: 'reagendamento', label: 'Cadências de Reagendamento', x: 55.0, y: 54.0 },
    { id: 'agendou', label: 'Agendou reunião?', x: 42.0, y: 54.0 },
    { id: 'reuniao_q', label: 'Reunião realizada?', x: 68.0, y: 54.0 },
    { id: 'cad_agenda', label: 'Cadência de agendamento de reunião', x: 26.0, y: 62.0 },
    { id: 'possivel', label: 'Possível fechamento?', x: 68.0, y: 64.0 },
    { id: 'conn_a', label: 'A', x: 26.0, y: 70.0 },
    { id: 'sql', label: 'SQL - SDR', x: 42.0, y: 70.0 },
    { id: 'sal', label: 'SAL - SDR', x: 68.0, y: 72.5 },
    { id: 'followup', label: 'Cadência de follow up para fechamento', x: 68.0, y: 79.0 },
    { id: 'fechou', label: 'Fechou contrato?', x: 68.0, y: 85.5 },
    { id: 'nutricao', label: 'Cadência de nutrição', x: 12.5, y: 86.5 },
    { id: 'contrato', label: 'Contrato Fechado', x: 68.0, y: 91.5 },
    { id: 'fluxo_cs', label: 'Fluxo Comercial CS', x: 42.0, y: 91.5 },
    { id: 'onboarding', label: 'Fluxo Onboarding CS', x: 42.0, y: 96.5 }
];

const FLUXO_INBOUND_PDF_EDGES = [
    { from: 'lead', to: 'icp', label: '' },
    { from: 'icp', to: 'cad_contato', label: 'SIM' },
    { from: 'icp', to: 'persona_mkt', label: 'NÃO' },
    { from: 'persona_mkt', to: 'descarte', label: 'NÃO' },
    { from: 'persona_mkt', to: 'nutricao', label: 'SIM' },
    { from: 'cad_contato', to: 'contato', label: '' },
    { from: 'contato', to: 'outbound', label: 'NÃO' },
    { from: 'contato', to: 'icp_sdr', label: 'SIM' },
    { from: 'icp_sdr', to: 'descarte', label: 'NÃO' },
    { from: 'icp_sdr', to: 'persona_sdr', label: 'SIM' },
    { from: 'persona_sdr', to: 'outbound', label: 'NÃO' },
    { from: 'persona_sdr', to: 'mql', label: 'SIM' },
    { from: 'mql', to: 'agendou', label: '' },
    { from: 'agendou', to: 'sql', label: 'SIM' },
    { from: 'agendou', to: 'cad_agenda', label: 'NÃO' },
    { from: 'cad_agenda', to: 'conn_a', label: '' },
    { from: 'conn_a', to: 'conn_a2', label: '' },
    { from: 'conn_a2', to: 'outbound', label: '' },
    { from: 'sql', to: 'reuniao_q', label: '' },
    { from: 'reuniao_q', to: 'reagendamento', label: 'NÃO' },
    { from: 'reuniao_q', to: 'possivel', label: 'SIM' },
    { from: 'reagendamento', to: 'agendou', label: '' },
    { from: 'possivel', to: 'outbound', label: 'NÃO' },
    { from: 'possivel', to: 'sal', label: 'SIM' },
    { from: 'sal', to: 'followup', label: '' },
    { from: 'followup', to: 'fechou', label: '' },
    { from: 'fechou', to: 'nutricao', label: 'NÃO' },
    { from: 'fechou', to: 'contrato', label: 'SIM' },
    { from: 'contrato', to: 'onboarding', label: '' },
    { from: 'fluxo_cs', to: 'nutricao', label: '' }
];

const FLUXO_OUTBOUND_PDF_HOTS = [
    { id: 'o_a', label: 'A', x: 12.5, y: 12.5 },
    { id: 'o_leads', label: 'Leads outbound', x: 42.0, y: 12.3 },
    { id: 'o_c1', label: 'C', x: 87.5, y: 12.3 },
    { id: 'o_nutricao', label: 'Cadência de nutrição', x: 87.5, y: 17.8 },
    { id: 'o_icp1', label: 'É ICP?', x: 42.0, y: 18.6 },
    { id: 'o_outra', label: 'Existe outra pessoa?', x: 55.5, y: 18.6 },
    { id: 'o_encontrou', label: 'Encontrou Persona?', x: 42.0, y: 25.2 },
    { id: 'o_fluxo_cs', label: 'Fluxo comercial CS', x: 12.5, y: 29.0 },
    { id: 'o_b', label: 'B', x: 12.5, y: 33.0 },
    { id: 'o_cad_contato', label: 'Cadência de Contato Inicial e Nutrição', x: 42.0, y: 32.0 },
    { id: 'o_contato', label: 'Conseguiu contato?', x: 42.0, y: 38.5 },
    { id: 'o_c2', label: 'C', x: 87.5, y: 38.5 },
    { id: 'o_descarte', label: 'Descarte', x: 27.0, y: 45.0 },
    { id: 'o_icp2', label: 'É ICP?', x: 42.0, y: 45.0 },
    { id: 'o_persona', label: 'É Persona?', x: 42.0, y: 51.8 },
    { id: 'o_c3', label: 'C', x: 87.5, y: 51.8 },
    { id: 'o_mql', label: 'MQL - BDR', x: 42.0, y: 58.5 },
    { id: 'o_redflag', label: 'Red flag?', x: 42.0, y: 65.0 },
    { id: 'o_cad_agenda', label: 'Cadência de agendamento de reunião', x: 25.0, y: 71.5 },
    { id: 'o_agendou', label: 'Agendou reunião?', x: 42.0, y: 71.5 },
    { id: 'o_reagendamento', label: 'Cadências de Reagendamento', x: 56.5, y: 71.5 },
    { id: 'o_c_agenda', label: 'C', x: 25.0, y: 77.0 },
    { id: 'o_sql', label: 'SQL - BDR', x: 42.0, y: 78.5 },
    { id: 'o_reuniao_q', label: 'Reunião realizada?', x: 68.0, y: 78.5 },
    { id: 'o_possivel', label: 'Possível fechamento?', x: 68.0, y: 84.5 },
    { id: 'o_c4', label: 'C', x: 87.5, y: 84.5 },
    { id: 'o_sal', label: 'SAL - BDR', x: 68.0, y: 89.0 },
    { id: 'o_followup', label: 'Cadência de follow up para fechamento', x: 68.0, y: 92.8 },
    { id: 'o_fechou', label: 'Fechou contrato?', x: 68.0, y: 95.8 },
    { id: 'o_c5', label: 'C', x: 87.5, y: 95.8 },
    { id: 'o_contrato', label: 'Contrato fechado', x: 68.0, y: 98.2 },
    { id: 'o_onboarding', label: 'Fluxo Onboarding', x: 12.5, y: 98.2 }
];

const FLUXO_OUTBOUND_PDF_EDGES = [
    { from: 'o_a', to: 'o_leads', label: '' },
    { from: 'o_leads', to: 'o_icp1', label: '' },
    { from: 'o_icp1', to: 'o_encontrou', label: 'SIM' },
    { from: 'o_icp1', to: 'o_outra', label: 'NÃO' },
    { from: 'o_outra', to: 'o_encontrou', label: 'SIM' },
    { from: 'o_outra', to: 'o_c1', label: 'NÃO' },
    { from: 'o_c1', to: 'o_nutricao', label: '' },
    { from: 'o_encontrou', to: 'o_cad_contato', label: 'SIM' },
    { from: 'o_encontrou', to: 'o_outra', label: 'NÃO' },
    { from: 'o_fluxo_cs', to: 'o_b', label: '' },
    { from: 'o_b', to: 'o_cad_contato', label: '' },
    { from: 'o_cad_contato', to: 'o_contato', label: '' },
    { from: 'o_contato', to: 'o_icp2', label: 'SIM' },
    { from: 'o_contato', to: 'o_c2', label: 'NÃO' },
    { from: 'o_icp2', to: 'o_persona', label: 'SIM' },
    { from: 'o_icp2', to: 'o_descarte', label: 'NÃO' },
    { from: 'o_persona', to: 'o_mql', label: 'SIM' },
    { from: 'o_persona', to: 'o_c3', label: 'NÃO' },
    { from: 'o_mql', to: 'o_redflag', label: '' },
    { from: 'o_redflag', to: 'o_agendou', label: 'NÃO' },
    { from: 'o_redflag', to: 'o_descarte', label: 'SIM' },
    { from: 'o_agendou', to: 'o_sql', label: 'SIM' },
    { from: 'o_agendou', to: 'o_cad_agenda', label: 'NÃO' },
    { from: 'o_cad_agenda', to: 'o_agendou', label: '' },
    { from: 'o_cad_agenda', to: 'o_c_agenda', label: '' },
    { from: 'o_sql', to: 'o_reuniao_q', label: '' },
    { from: 'o_reuniao_q', to: 'o_possivel', label: 'SIM' },
    { from: 'o_reuniao_q', to: 'o_reagendamento', label: 'NÃO' },
    { from: 'o_reagendamento', to: 'o_agendou', label: '' },
    { from: 'o_possivel', to: 'o_sal', label: 'SIM' },
    { from: 'o_possivel', to: 'o_c4', label: 'NÃO' },
    { from: 'o_sal', to: 'o_followup', label: '' },
    { from: 'o_followup', to: 'o_fechou', label: '' },
    { from: 'o_fechou', to: 'o_contrato', label: 'SIM' },
    { from: 'o_fechou', to: 'o_c5', label: 'NÃO' },
    { from: 'o_contrato', to: 'o_onboarding', label: '' }
];

initFluxoPdfUX({
    viewportId: 'fluxoInboundViewport',
    zoomId: 'fluxoInboundZoom',
    stageId: 'fluxoInboundStage',
    imgId: 'fluxoInboundImg',
    hotsId: 'fluxoInboundHots',
    svgId: 'fluxoInboundPathSvg',
    toolbarId: 'fluxoInboundToolbar',
    stripId: 'fluxoInboundPathStrip',
    stripTextId: 'fluxoInboundPathText',
    defaultVer: 'v2',
    sources: {
        v2: 'assets/fluxo-inbound-oficial.png',
        v1: 'assets/fluxo-inbound-oficial-v1.png'
    },
    hots: { v2: FLUXO_INBOUND_PDF_HOTS, v1: [] },
    edges: { v2: FLUXO_INBOUND_PDF_EDGES, v1: [] }
});

initFluxoPdfUX({
    viewportId: 'fluxoOutboundViewport',
    zoomId: 'fluxoOutboundZoom',
    stageId: 'fluxoOutboundStage',
    imgId: 'fluxoOutboundImg',
    hotsId: 'fluxoOutboundHots',
    svgId: 'fluxoOutboundPathSvg',
    toolbarId: 'fluxoOutboundToolbar',
    stripId: 'fluxoOutboundPathStrip',
    stripTextId: 'fluxoOutboundPathText',
    defaultVer: 'v2',
    sources: {
        v2: 'assets/fluxo-outbound-oficial.png',
        v1: 'assets/fluxo-outbound-oficial-v1.png'
    },
    hots: { v2: FLUXO_OUTBOUND_PDF_HOTS, v1: [] },
    edges: { v2: FLUXO_OUTBOUND_PDF_EDGES, v1: [] }
});

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

/* Funil Inbound: prévia enxuta (ocultar etapas candidatas) */
(() => {
    const btn = document.getElementById('funilInboundSlimToggle');
    const grid = document.getElementById('funilInboundGrid');
    if (!btn || !grid) return;
    btn.addEventListener('click', () => {
        const slim = grid.classList.toggle('is-slim-view');
        btn.classList.toggle('is-active', slim);
        btn.setAttribute('aria-pressed', slim ? 'true' : 'false');
        btn.textContent = slim ? 'Mostrar etapas sugeridas' : 'Ocultar etapas sugeridas';
    });
})();
