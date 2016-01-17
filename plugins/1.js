function t(vo, setVariables) {
	var s = this, notReadyToTrack, trk = 1, tm = new Date, sed = Math
			&& Math.random ? Math.floor(Math.random() * 10000000000000) : tm
			.getTime(), sess = 's' + Math.floor(tm.getTime() / 10800000) % 10
			+ sed, y = tm.getYear(), vt = tm.getDate() + '/' + tm.getMonth()
			+ '/' + (y < 1900 ? y + 1900 : y) + ' ' + tm.getHours() + ':'
			+ tm.getMinutes() + ':' + tm.getSeconds() + ' ' + tm.getDay() + ' '
			+ tm.getTimezoneOffset(), tcf, tfs = s.gtfs(), ta = -1, q = '', qs = '', code = '', vb = new Object;
	if ((!s.supplementalDataID) && (s.visitor)
			&& (s.visitor.getSupplementalDataID)) {
		s.supplementalDataID = s.visitor.getSupplementalDataID(
				"AppMeasurement:" + s._in, (s.expectSupplementalData ? false
						: true));
	}
	if (s.mpc('t', arguments))
		return;
	s.gl(s.vl_g);
	s.uns();
	s.m_ll();
	notReadyToTrack = s._handleNotReadyToTrack(vo);
	if (!notReadyToTrack) {
		if (setVariables) {
			s.voa(setVariables);
		}
		if (!s.td) {
			var tl = tfs.location, a, o, i, x = '', c = '', v = '', p = '', bw = '', bh = '', j = '1.0', k = s
					.c_w('s_cc', 'true', 0) ? 'Y' : 'N', hp = '', ct = '', pn = 0, ps;
			if (String && String.prototype) {
				j = '1.1';
				if (j.match) {
					j = '1.2';
					if (tm.setUTCDate) {
						j = '1.3';
						if (s.isie && s.ismac && s.apv >= 5)
							j = '1.4';
						if (pn.toPrecision) {
							j = '1.5';
							a = new Array;
							if (a.forEach) {
								j = '1.6';
								i = 0;
								o = new Object;
								tcf = new Function('o',
										'var e,i=0;try{i=new Iterator(o)}catch(e){}return i');
								i = tcf(o);
								if (i && i.next) {
									j = '1.7';
									if (a.reduce) {
										j = '1.8';
										if (j.trim) {
											j = '1.8.1';
											if (Date.parse) {
												j = '1.8.2';
												if (Object.create)
													j = '1.8.5'
											}
										}
									}
								}
							}
						}
					}
				}
			}
			if (s.apv >= 4)
				x = screen.width + 'x' + screen.height;
			if (s.isns || s.isopera) {
				if (s.apv >= 3) {
					v = s.n.javaEnabled() ? 'Y' : 'N';
					if (s.apv >= 4) {
						c = screen.pixelDepth;
						bw = s.wd.innerWidth;
						bh = s.wd.innerHeight
					}
				}
				s.pl = s.n.plugins
			} else if (s.isie) {
				if (s.apv >= 4) {
					v = s.n.javaEnabled() ? 'Y' : 'N';
					c = screen.colorDepth;
					if (s.apv >= 5) {
						bw = s.d.documentElement.offsetWidth;
						bh = s.d.documentElement.offsetHeight;
						if (!s.ismac && s.b) {
							tcf = new Function(
									's',
									'tl',
									'var e,hp=0;try{s.b.addBehavior("#default#homePage");hp=s.b.isHomePage(tl)?"Y":"N"}catch(e){}return hp');
							hp = tcf(s, tl);
							tcf = new Function(
									's',
									'var e,ct=0;try{s.b.addBehavior("#default#clientCaps");ct=s.b.connectionType}catch(e){}return ct');
							ct = tcf(s)
						}
					}
				} else
					r = ''
			}
			if (s.pl)
				while (pn < s.pl.length && pn < 30) {
					ps = s.fl(s.pl[pn].name, 100) + ';';
					if (p.indexOf(ps) < 0)
						p += ps;
					pn++
				}
			s.resolution = x;
			s.colorDepth = c;
			s.javascriptVersion = j;
			s.javaEnabled = v;
			s.cookiesEnabled = k;
			s.browserWidth = bw;
			s.browserHeight = bh;
			s.connectionType = ct;
			s.homepage = hp;
			s.plugins = p;
			s.td = 1
		}
		if (vo) {
			s.vob(vb);
			s.voa(vo)
		}
		if (!s.analyticsVisitorID && !s.marketingCloudVisitorID)
			s.fid = s.gfid();
		if ((vo && vo._t) || !s.m_m('d')) {
			if (s.usePlugins)
				s.doPlugins(s);
			if (!s.abort) {
				var l = s.wd.location, r = tfs.document.referrer;
				if (!s.pageURL)
					s.pageURL = l.href ? l.href : l;
				if (!s.referrer && !s._1_referrer) {
					s.referrer = r;
					s._1_referrer = 1
				}
				s.m_m('g');
				if (s.lnk || s.eo) {
					var o = s.eo ? s.eo : s.lnk, p = s.pageName, w = 1, t = s
							.ot(o), n = s.oid(o), x = o.s_oidt, h, l, i, oc;
					if (s.eo && o == s.eo) {
						while (o && !n && t != 'BODY') {
							o = o.parentElement ? o.parentElement
									: o.parentNode;
							if (o) {
								t = s.ot(o);
								n = s.oid(o);
								x = o.s_oidt
							}
						}
						if (!n || t == 'BODY')
							o = '';
						if (o) {
							oc = o.onclick ? '' + o.onclick : '';
							if ((oc.indexOf('s_gs(') >= 0 && oc
									.indexOf('.s_oc(') < 0)
									|| oc.indexOf('.tl(') >= 0)
								o = 0
						}
					}
					if (o) {
						if (n)
							ta = o.target;
						h = s.oh(o);
						i = h.indexOf('?');
						h = s.linkLeaveQueryString || i < 0 ? h : h.substring(
								0, i);
						l = s.linkName;
						t = s.linkType ? s.linkType.toLowerCase() : s.lt(h);
						if (t && (h || l)) {
							s.pe = 'lnk_' + (t == 'd' || t == 'e' ? t : 'o');
							s.pev1 = (h ? s.ape(h) : '');
							s.pev2 = (l ? s.ape(l) : '')
						} else
							trk = 0;
						if (s.trackInlineStats) {
							if (!p) {
								p = s.pageURL;
								w = 0
							}
							t = s.ot(o);
							i = o.sourceIndex;
							if (o.dataset && o.dataset.sObjectId) {
								s.wd.s_objectID = o.dataset.sObjectId;
							} else if (o.getAttribute
									&& o.getAttribute('data-s-object-id')) {
								s.wd.s_objectID = o
										.getAttribute('data-s-object-id');
							} else if (s.useForcedLinkTracking) {
								s.wd.s_objectID = '';
								oc = o.onclick ? '' + o.onclick : '';
								if (oc) {
									var ocb = oc.indexOf('s_objectID'), oce, ocq, ocx;
									if (ocb >= 0) {
										ocb += 10;
										while (ocb < oc.length
												&& ("= \t\r\n").indexOf(oc
														.charAt(ocb)) >= 0)
											ocb++;
										if (ocb < oc.length) {
											oce = ocb;
											ocq = ocx = 0;
											while (oce < oc.length
													&& (oc.charAt(oce) != ';' || ocq)) {
												if (ocq) {
													if (oc.charAt(oce) == ocq
															&& !ocx)
														ocq = 0;
													else if (oc.charAt(oce) == "\\")
														ocx = !ocx;
													else
														ocx = 0;
												} else {
													ocq = oc.charAt(oce);
													if (ocq != '"'
															&& ocq != "'")
														ocq = 0
												}
												oce++;
											}
											oc = oc.substring(ocb, oce);
											if (oc) {
												o.s_soid = new Function('s',
														'var e;try{s.wd.s_objectID='
																+ oc
																+ '}catch(e){}');
												o.s_soid(s)
											}
										}
									}
								}
							}
							if (s.gg('objectID')) {
								n = s.gg('objectID');
								x = 1;
								i = 1
							}
							if (p && n && t)
								qs = '&pid=' + s.ape(s.fl(p, 255))
										+ (w ? '&pidt=' + w : '') + '&oid='
										+ s.ape(s.fl(n, 100))
										+ (x ? '&oidt=' + x : '') + '&ot='
										+ s.ape(t) + (i ? '&oi=' + i : '')
						}
					} else
						trk = 0
				}
				if (trk || qs) {
					s.sampled = s.vs(sed);
					if (trk) {
						if (s.sampled)
							code = s.mr(sess, (vt ? '&t=' + s.ape(vt) : '')
									+ s.hav() + q + (qs ? qs : s.rq()), 0, ta);
						qs = '';
						s.m_m('t');
						if (s.p_r)
							s.p_r();
						s.referrer = s.lightProfileID = s.retrieveLightProfiles = s.deleteLightProfiles = ''
					}
					s.sq(qs)
				}
			}
		} else
			s.dl(vo);
		if (vo)
			s.voa(vb, 1);
	}
	s.abort = 0;
	s.supplementalDataID = s.pageURLRest = s.lnk = s.eo = s.linkName = s.linkType = s.wd.s_objectID = s.ppu = s.pe = s.pev1 = s.pev2 = s.pev3 = '';
	if (s.pg)
		s.wd.s_lnk = s.wd.s_eo = s.wd.s_linkName = s.wd.s_linkType = '';
	return code
}