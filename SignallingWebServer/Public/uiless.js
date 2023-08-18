!(function (e, t) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define([], t)
    : 'object' == typeof exports
    ? (exports['epicgames-frontend'] = t())
    : (e['epicgames-frontend'] = t());
})(this, () =>
  (() => {
    'use strict';
    var e = {
        942: (e) => {
          const t = {
            generateIdentifier: function () {
              return Math.random().toString(36).substring(2, 12);
            },
          };
          (t.localCName = t.generateIdentifier()),
            (t.splitLines = function (e) {
              return e
                .trim()
                .split('\n')
                .map((e) => e.trim());
            }),
            (t.splitSections = function (e) {
              return e
                .split('\nm=')
                .map((e, t) => (t > 0 ? 'm=' + e : e).trim() + '\r\n');
            }),
            (t.getDescription = function (e) {
              const s = t.splitSections(e);
              return s && s[0];
            }),
            (t.getMediaSections = function (e) {
              const s = t.splitSections(e);
              return s.shift(), s;
            }),
            (t.matchPrefix = function (e, s) {
              return t.splitLines(e).filter((e) => 0 === e.indexOf(s));
            }),
            (t.parseCandidate = function (e) {
              let t;
              t =
                0 === e.indexOf('a=candidate:')
                  ? e.substring(12).split(' ')
                  : e.substring(10).split(' ');
              const s = {
                foundation: t[0],
                component: { 1: 'rtp', 2: 'rtcp' }[t[1]] || t[1],
                protocol: t[2].toLowerCase(),
                priority: parseInt(t[3], 10),
                ip: t[4],
                address: t[4],
                port: parseInt(t[5], 10),
                type: t[7],
              };
              for (let e = 8; e < t.length; e += 2)
                switch (t[e]) {
                  case 'raddr':
                    s.relatedAddress = t[e + 1];
                    break;
                  case 'rport':
                    s.relatedPort = parseInt(t[e + 1], 10);
                    break;
                  case 'tcptype':
                    s.tcpType = t[e + 1];
                    break;
                  case 'ufrag':
                    (s.ufrag = t[e + 1]), (s.usernameFragment = t[e + 1]);
                    break;
                  default:
                    void 0 === s[t[e]] && (s[t[e]] = t[e + 1]);
                }
              return s;
            }),
            (t.writeCandidate = function (e) {
              const t = [];
              t.push(e.foundation);
              const s = e.component;
              'rtp' === s ? t.push(1) : 'rtcp' === s ? t.push(2) : t.push(s),
                t.push(e.protocol.toUpperCase()),
                t.push(e.priority),
                t.push(e.address || e.ip),
                t.push(e.port);
              const n = e.type;
              return (
                t.push('typ'),
                t.push(n),
                'host' !== n &&
                  e.relatedAddress &&
                  e.relatedPort &&
                  (t.push('raddr'),
                  t.push(e.relatedAddress),
                  t.push('rport'),
                  t.push(e.relatedPort)),
                e.tcpType &&
                  'tcp' === e.protocol.toLowerCase() &&
                  (t.push('tcptype'), t.push(e.tcpType)),
                (e.usernameFragment || e.ufrag) &&
                  (t.push('ufrag'), t.push(e.usernameFragment || e.ufrag)),
                'candidate:' + t.join(' ')
              );
            }),
            (t.parseIceOptions = function (e) {
              return e.substring(14).split(' ');
            }),
            (t.parseRtpMap = function (e) {
              let t = e.substring(9).split(' ');
              const s = { payloadType: parseInt(t.shift(), 10) };
              return (
                (t = t[0].split('/')),
                (s.name = t[0]),
                (s.clockRate = parseInt(t[1], 10)),
                (s.channels = 3 === t.length ? parseInt(t[2], 10) : 1),
                (s.numChannels = s.channels),
                s
              );
            }),
            (t.writeRtpMap = function (e) {
              let t = e.payloadType;
              void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
              const s = e.channels || e.numChannels || 1;
              return (
                'a=rtpmap:' +
                t +
                ' ' +
                e.name +
                '/' +
                e.clockRate +
                (1 !== s ? '/' + s : '') +
                '\r\n'
              );
            }),
            (t.parseExtmap = function (e) {
              const t = e.substring(9).split(' ');
              return {
                id: parseInt(t[0], 10),
                direction:
                  t[0].indexOf('/') > 0 ? t[0].split('/')[1] : 'sendrecv',
                uri: t[1],
                attributes: t.slice(2).join(' '),
              };
            }),
            (t.writeExtmap = function (e) {
              return (
                'a=extmap:' +
                (e.id || e.preferredId) +
                (e.direction && 'sendrecv' !== e.direction
                  ? '/' + e.direction
                  : '') +
                ' ' +
                e.uri +
                (e.attributes ? ' ' + e.attributes : '') +
                '\r\n'
              );
            }),
            (t.parseFmtp = function (e) {
              const t = {};
              let s;
              const n = e.substring(e.indexOf(' ') + 1).split(';');
              for (let e = 0; e < n.length; e++)
                (s = n[e].trim().split('=')), (t[s[0].trim()] = s[1]);
              return t;
            }),
            (t.writeFmtp = function (e) {
              let t = '',
                s = e.payloadType;
              if (
                (void 0 !== e.preferredPayloadType &&
                  (s = e.preferredPayloadType),
                e.parameters && Object.keys(e.parameters).length)
              ) {
                const n = [];
                Object.keys(e.parameters).forEach((t) => {
                  void 0 !== e.parameters[t]
                    ? n.push(t + '=' + e.parameters[t])
                    : n.push(t);
                }),
                  (t += 'a=fmtp:' + s + ' ' + n.join(';') + '\r\n');
              }
              return t;
            }),
            (t.parseRtcpFb = function (e) {
              const t = e.substring(e.indexOf(' ') + 1).split(' ');
              return { type: t.shift(), parameter: t.join(' ') };
            }),
            (t.writeRtcpFb = function (e) {
              let t = '',
                s = e.payloadType;
              return (
                void 0 !== e.preferredPayloadType &&
                  (s = e.preferredPayloadType),
                e.rtcpFeedback &&
                  e.rtcpFeedback.length &&
                  e.rtcpFeedback.forEach((e) => {
                    t +=
                      'a=rtcp-fb:' +
                      s +
                      ' ' +
                      e.type +
                      (e.parameter && e.parameter.length
                        ? ' ' + e.parameter
                        : '') +
                      '\r\n';
                  }),
                t
              );
            }),
            (t.parseSsrcMedia = function (e) {
              const t = e.indexOf(' '),
                s = { ssrc: parseInt(e.substring(7, t), 10) },
                n = e.indexOf(':', t);
              return (
                n > -1
                  ? ((s.attribute = e.substring(t + 1, n)),
                    (s.value = e.substring(n + 1)))
                  : (s.attribute = e.substring(t + 1)),
                s
              );
            }),
            (t.parseSsrcGroup = function (e) {
              const t = e.substring(13).split(' ');
              return {
                semantics: t.shift(),
                ssrcs: t.map((e) => parseInt(e, 10)),
              };
            }),
            (t.getMid = function (e) {
              const s = t.matchPrefix(e, 'a=mid:')[0];
              if (s) return s.substring(6);
            }),
            (t.parseFingerprint = function (e) {
              const t = e.substring(14).split(' ');
              return {
                algorithm: t[0].toLowerCase(),
                value: t[1].toUpperCase(),
              };
            }),
            (t.getDtlsParameters = function (e, s) {
              return {
                role: 'auto',
                fingerprints: t
                  .matchPrefix(e + s, 'a=fingerprint:')
                  .map(t.parseFingerprint),
              };
            }),
            (t.writeDtlsParameters = function (e, t) {
              let s = 'a=setup:' + t + '\r\n';
              return (
                e.fingerprints.forEach((e) => {
                  s += 'a=fingerprint:' + e.algorithm + ' ' + e.value + '\r\n';
                }),
                s
              );
            }),
            (t.parseCryptoLine = function (e) {
              const t = e.substring(9).split(' ');
              return {
                tag: parseInt(t[0], 10),
                cryptoSuite: t[1],
                keyParams: t[2],
                sessionParams: t.slice(3),
              };
            }),
            (t.writeCryptoLine = function (e) {
              return (
                'a=crypto:' +
                e.tag +
                ' ' +
                e.cryptoSuite +
                ' ' +
                ('object' == typeof e.keyParams
                  ? t.writeCryptoKeyParams(e.keyParams)
                  : e.keyParams) +
                (e.sessionParams ? ' ' + e.sessionParams.join(' ') : '') +
                '\r\n'
              );
            }),
            (t.parseCryptoKeyParams = function (e) {
              if (0 !== e.indexOf('inline:')) return null;
              const t = e.substring(7).split('|');
              return {
                keyMethod: 'inline',
                keySalt: t[0],
                lifeTime: t[1],
                mkiValue: t[2] ? t[2].split(':')[0] : void 0,
                mkiLength: t[2] ? t[2].split(':')[1] : void 0,
              };
            }),
            (t.writeCryptoKeyParams = function (e) {
              return (
                e.keyMethod +
                ':' +
                e.keySalt +
                (e.lifeTime ? '|' + e.lifeTime : '') +
                (e.mkiValue && e.mkiLength
                  ? '|' + e.mkiValue + ':' + e.mkiLength
                  : '')
              );
            }),
            (t.getCryptoParameters = function (e, s) {
              return t.matchPrefix(e + s, 'a=crypto:').map(t.parseCryptoLine);
            }),
            (t.getIceParameters = function (e, s) {
              const n = t.matchPrefix(e + s, 'a=ice-ufrag:')[0],
                r = t.matchPrefix(e + s, 'a=ice-pwd:')[0];
              return n && r
                ? {
                    usernameFragment: n.substring(12),
                    password: r.substring(10),
                  }
                : null;
            }),
            (t.writeIceParameters = function (e) {
              let t =
                'a=ice-ufrag:' +
                e.usernameFragment +
                '\r\na=ice-pwd:' +
                e.password +
                '\r\n';
              return e.iceLite && (t += 'a=ice-lite\r\n'), t;
            }),
            (t.parseRtpParameters = function (e) {
              const s = {
                  codecs: [],
                  headerExtensions: [],
                  fecMechanisms: [],
                  rtcp: [],
                },
                n = t.splitLines(e)[0].split(' ');
              for (let r = 3; r < n.length; r++) {
                const i = n[r],
                  o = t.matchPrefix(e, 'a=rtpmap:' + i + ' ')[0];
                if (o) {
                  const n = t.parseRtpMap(o),
                    r = t.matchPrefix(e, 'a=fmtp:' + i + ' ');
                  switch (
                    ((n.parameters = r.length ? t.parseFmtp(r[0]) : {}),
                    (n.rtcpFeedback = t
                      .matchPrefix(e, 'a=rtcp-fb:' + i + ' ')
                      .map(t.parseRtcpFb)),
                    s.codecs.push(n),
                    n.name.toUpperCase())
                  ) {
                    case 'RED':
                    case 'ULPFEC':
                      s.fecMechanisms.push(n.name.toUpperCase());
                  }
                }
              }
              t.matchPrefix(e, 'a=extmap:').forEach((e) => {
                s.headerExtensions.push(t.parseExtmap(e));
              });
              const r = t.matchPrefix(e, 'a=rtcp-fb:* ').map(t.parseRtcpFb);
              return (
                s.codecs.forEach((e) => {
                  r.forEach((t) => {
                    e.rtcpFeedback.find(
                      (e) => e.type === t.type && e.parameter === t.parameter,
                    ) || e.rtcpFeedback.push(t);
                  });
                }),
                s
              );
            }),
            (t.writeRtpDescription = function (e, s) {
              let n = '';
              (n += 'm=' + e + ' '),
                (n += s.codecs.length > 0 ? '9' : '0'),
                (n += ' UDP/TLS/RTP/SAVPF '),
                (n +=
                  s.codecs
                    .map((e) =>
                      void 0 !== e.preferredPayloadType
                        ? e.preferredPayloadType
                        : e.payloadType,
                    )
                    .join(' ') + '\r\n'),
                (n += 'c=IN IP4 0.0.0.0\r\n'),
                (n += 'a=rtcp:9 IN IP4 0.0.0.0\r\n'),
                s.codecs.forEach((e) => {
                  (n += t.writeRtpMap(e)),
                    (n += t.writeFmtp(e)),
                    (n += t.writeRtcpFb(e));
                });
              let r = 0;
              return (
                s.codecs.forEach((e) => {
                  e.maxptime > r && (r = e.maxptime);
                }),
                r > 0 && (n += 'a=maxptime:' + r + '\r\n'),
                s.headerExtensions &&
                  s.headerExtensions.forEach((e) => {
                    n += t.writeExtmap(e);
                  }),
                n
              );
            }),
            (t.parseRtpEncodingParameters = function (e) {
              const s = [],
                n = t.parseRtpParameters(e),
                r = -1 !== n.fecMechanisms.indexOf('RED'),
                i = -1 !== n.fecMechanisms.indexOf('ULPFEC'),
                o = t
                  .matchPrefix(e, 'a=ssrc:')
                  .map((e) => t.parseSsrcMedia(e))
                  .filter((e) => 'cname' === e.attribute),
                a = o.length > 0 && o[0].ssrc;
              let l;
              const d = t.matchPrefix(e, 'a=ssrc-group:FID').map((e) =>
                e
                  .substring(17)
                  .split(' ')
                  .map((e) => parseInt(e, 10)),
              );
              d.length > 0 && d[0].length > 1 && d[0][0] === a && (l = d[0][1]),
                n.codecs.forEach((e) => {
                  if ('RTX' === e.name.toUpperCase() && e.parameters.apt) {
                    let t = {
                      ssrc: a,
                      codecPayloadType: parseInt(e.parameters.apt, 10),
                    };
                    a && l && (t.rtx = { ssrc: l }),
                      s.push(t),
                      r &&
                        ((t = JSON.parse(JSON.stringify(t))),
                        (t.fec = {
                          ssrc: a,
                          mechanism: i ? 'red+ulpfec' : 'red',
                        }),
                        s.push(t));
                  }
                }),
                0 === s.length && a && s.push({ ssrc: a });
              let c = t.matchPrefix(e, 'b=');
              return (
                c.length &&
                  ((c =
                    0 === c[0].indexOf('b=TIAS:')
                      ? parseInt(c[0].substring(7), 10)
                      : 0 === c[0].indexOf('b=AS:')
                      ? 1e3 * parseInt(c[0].substring(5), 10) * 0.95 - 16e3
                      : void 0),
                  s.forEach((e) => {
                    e.maxBitrate = c;
                  })),
                s
              );
            }),
            (t.parseRtcpParameters = function (e) {
              const s = {},
                n = t
                  .matchPrefix(e, 'a=ssrc:')
                  .map((e) => t.parseSsrcMedia(e))
                  .filter((e) => 'cname' === e.attribute)[0];
              n && ((s.cname = n.value), (s.ssrc = n.ssrc));
              const r = t.matchPrefix(e, 'a=rtcp-rsize');
              (s.reducedSize = r.length > 0), (s.compound = 0 === r.length);
              const i = t.matchPrefix(e, 'a=rtcp-mux');
              return (s.mux = i.length > 0), s;
            }),
            (t.writeRtcpParameters = function (e) {
              let t = '';
              return (
                e.reducedSize && (t += 'a=rtcp-rsize\r\n'),
                e.mux && (t += 'a=rtcp-mux\r\n'),
                void 0 !== e.ssrc &&
                  e.cname &&
                  (t += 'a=ssrc:' + e.ssrc + ' cname:' + e.cname + '\r\n'),
                t
              );
            }),
            (t.parseMsid = function (e) {
              let s;
              const n = t.matchPrefix(e, 'a=msid:');
              if (1 === n.length)
                return (
                  (s = n[0].substring(7).split(' ')),
                  { stream: s[0], track: s[1] }
                );
              const r = t
                .matchPrefix(e, 'a=ssrc:')
                .map((e) => t.parseSsrcMedia(e))
                .filter((e) => 'msid' === e.attribute);
              return r.length > 0
                ? ((s = r[0].value.split(' ')), { stream: s[0], track: s[1] })
                : void 0;
            }),
            (t.parseSctpDescription = function (e) {
              const s = t.parseMLine(e),
                n = t.matchPrefix(e, 'a=max-message-size:');
              let r;
              n.length > 0 && (r = parseInt(n[0].substring(19), 10)),
                isNaN(r) && (r = 65536);
              const i = t.matchPrefix(e, 'a=sctp-port:');
              if (i.length > 0)
                return {
                  port: parseInt(i[0].substring(12), 10),
                  protocol: s.fmt,
                  maxMessageSize: r,
                };
              const o = t.matchPrefix(e, 'a=sctpmap:');
              if (o.length > 0) {
                const e = o[0].substring(10).split(' ');
                return {
                  port: parseInt(e[0], 10),
                  protocol: e[1],
                  maxMessageSize: r,
                };
              }
            }),
            (t.writeSctpDescription = function (e, t) {
              let s = [];
              return (
                (s =
                  'DTLS/SCTP' !== e.protocol
                    ? [
                        'm=' +
                          e.kind +
                          ' 9 ' +
                          e.protocol +
                          ' ' +
                          t.protocol +
                          '\r\n',
                        'c=IN IP4 0.0.0.0\r\n',
                        'a=sctp-port:' + t.port + '\r\n',
                      ]
                    : [
                        'm=' +
                          e.kind +
                          ' 9 ' +
                          e.protocol +
                          ' ' +
                          t.port +
                          '\r\n',
                        'c=IN IP4 0.0.0.0\r\n',
                        'a=sctpmap:' + t.port + ' ' + t.protocol + ' 65535\r\n',
                      ]),
                void 0 !== t.maxMessageSize &&
                  s.push('a=max-message-size:' + t.maxMessageSize + '\r\n'),
                s.join('')
              );
            }),
            (t.generateSessionId = function () {
              return Math.random().toString().substr(2, 22);
            }),
            (t.writeSessionBoilerplate = function (e, s, n) {
              let r;
              const i = void 0 !== s ? s : 2;
              return (
                (r = e || t.generateSessionId()),
                'v=0\r\no=' +
                  (n || 'thisisadapterortc') +
                  ' ' +
                  r +
                  ' ' +
                  i +
                  ' IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n'
              );
            }),
            (t.getDirection = function (e, s) {
              const n = t.splitLines(e);
              for (let e = 0; e < n.length; e++)
                switch (n[e]) {
                  case 'a=sendrecv':
                  case 'a=sendonly':
                  case 'a=recvonly':
                  case 'a=inactive':
                    return n[e].substring(2);
                }
              return s ? t.getDirection(s) : 'sendrecv';
            }),
            (t.getKind = function (e) {
              return t.splitLines(e)[0].split(' ')[0].substring(2);
            }),
            (t.isRejected = function (e) {
              return '0' === e.split(' ', 2)[1];
            }),
            (t.parseMLine = function (e) {
              const s = t.splitLines(e)[0].substring(2).split(' ');
              return {
                kind: s[0],
                port: parseInt(s[1], 10),
                protocol: s[2],
                fmt: s.slice(3).join(' '),
              };
            }),
            (t.parseOLine = function (e) {
              const s = t.matchPrefix(e, 'o=')[0].substring(2).split(' ');
              return {
                username: s[0],
                sessionId: s[1],
                sessionVersion: parseInt(s[2], 10),
                netType: s[3],
                addressType: s[4],
                address: s[5],
              };
            }),
            (t.isValidSDP = function (e) {
              if ('string' != typeof e || 0 === e.length) return !1;
              const s = t.splitLines(e);
              for (let e = 0; e < s.length; e++)
                if (s[e].length < 2 || '=' !== s[e].charAt(1)) return !1;
              return !0;
            }),
            (e.exports = t);
        },
      },
      t = {};
    function s(n) {
      var r = t[n];
      if (void 0 !== r) return r.exports;
      var i = (t[n] = { exports: {} });
      return e[n](i, i.exports, s), i.exports;
    }
    s.r = (e) => {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(e, '__esModule', { value: !0 });
    };
    var n = {};
    return (
      (() => {
        s.r(n);
        var e,
          t,
          r,
          i = s(942),
          o = {
            d: (e, t) => {
              for (var s in t)
                o.o(t, s) &&
                  !o.o(e, s) &&
                  Object.defineProperty(e, s, { enumerable: !0, get: t[s] });
            },
            o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
          },
          a = {};
        o.d(a, {
          Dz: () => ye,
          g$: () => O,
          Lt: () => F,
          Q9: () => D,
          qf: () => A,
          hV: () => xe,
          z$: () => Pe,
          J0: () => we,
          De: () => fe,
          $C: () => Ce,
          al: () => W,
          _W: () => N,
          tz: () => V,
          Nu: () => Me,
          zg: () => _e,
          vp: () => de,
          vU: () => ce,
          wF: () => ee,
          rv: () => Ee,
          Nh: () => be,
          ss: () => ze,
          qW: () => re,
          QL: () => ne,
          cf: () => Ve,
          eM: () => Z,
          Yd: () => l,
          iM: () => C,
          qy: () => d,
          ce: () => y,
          sK: () => ue,
          Ok: () => Se,
          q5: () => ke,
          g: () => bt,
          xl: () => j,
          I: () => J,
          bx: () => Y,
          Ib: () => P,
          Az: () => k,
          Iw: () => R,
          qY: () => x,
          db: () => L,
          mR: () => ie,
          Tn: () => T,
          rV: () => te,
          gh: () => Q,
          Mi: () => $,
          j: () => q,
          YB: () => X,
          i5: () => se,
          x_: () => me,
          Am: () => pt,
          eR: () => I,
          r8: () => K,
          u3: () => He,
          vd: () => G,
          iV: () => B,
          jZ: () => z,
          SW: () => H,
          ZH: () => _,
          Ni: () => vt,
          lh: () => U,
          bq: () => E,
          $f: () => Tt,
          eu: () => le,
          Ax: () => ae,
          Mc: () => oe,
        });
        class l {
          static GetStackTrace() {
            const e = new Error();
            let t = 'No Stack Available for this browser';
            return e.stack && (t = e.stack.toString().replace(/Error/g, '')), t;
          }
          static SetLoggerVerbosity(e) {
            null != this.verboseLogLevel && (this.verboseLogLevel = e);
          }
          static Log(e, t, s) {
            if (s > this.verboseLogLevel) return;
            const n = `Level: Log\nMsg: ${t}\nCaller: ${e}`;
            console.log(n);
          }
          static Info(e, t, s) {
            if (s > this.verboseLogLevel) return;
            const n = `Level: Info\nMsg: ${t}`;
            console.info(n);
          }
          static Error(e, t) {
            const s = `Level: Error\nMsg: ${t}\nCaller: ${e}`;
            console.error(s);
          }
          static Warning(e, t) {
            const s = `Level: Warning\nCaller: ${e}\nMsg: ${t}`;
            console.warn(s);
          }
        }
        (l.verboseLogLevel = 5),
          ((r = e || (e = {})).LIST_STREAMERS = 'listStreamers'),
          (r.SUBSCRIBE = 'subscribe'),
          (r.UNSUBSCRIBE = 'unsubscribe'),
          (r.ICE_CANDIDATE = 'iceCandidate'),
          (r.OFFER = 'offer'),
          (r.ANSWER = 'answer'),
          (r.DATACHANNELREQUEST = 'dataChannelRequest'),
          (r.SFURECVDATACHANNELREADY = 'peerDataChannelsReady'),
          (r.PONG = 'pong');
        class d {
          payload() {
            return (
              l.Log(
                l.GetStackTrace(),
                'Sending => \n' + JSON.stringify(this, void 0, 4),
                6,
              ),
              JSON.stringify(this)
            );
          }
        }
        class c extends d {
          constructor() {
            super(), (this.type = e.LIST_STREAMERS);
          }
        }
        class h extends d {
          constructor(t) {
            super(), (this.type = e.SUBSCRIBE), (this.streamerId = t);
          }
        }
        class u extends d {
          constructor() {
            super(), (this.type = e.UNSUBSCRIBE);
          }
        }
        class g extends d {
          constructor(t) {
            super(), (this.type = e.PONG), (this.time = t);
          }
        }
        class m extends d {
          constructor(t) {
            super(),
              (this.type = e.OFFER),
              t && ((this.type = t.type), (this.sdp = t.sdp));
          }
        }
        class p extends d {
          constructor(t) {
            super(),
              (this.type = e.ANSWER),
              t && ((this.type = t.type), (this.sdp = t.sdp));
          }
        }
        class S extends d {
          constructor() {
            super(), (this.type = e.DATACHANNELREQUEST);
          }
        }
        class v extends d {
          constructor() {
            super(), (this.type = e.SFURECVDATACHANNELREADY);
          }
        }
        class f {
          constructor(t) {
            (this.type = e.ICE_CANDIDATE), (this.candidate = t);
          }
          payload() {
            return (
              l.Log(
                l.GetStackTrace(),
                'Sending => \n' + JSON.stringify(this, void 0, 4),
                6,
              ),
              JSON.stringify(this)
            );
          }
        }
        !(function (e) {
          (e.CONFIG = 'config'),
            (e.STREAMER_LIST = 'streamerList'),
            (e.PLAYER_COUNT = 'playerCount'),
            (e.OFFER = 'offer'),
            (e.ANSWER = 'answer'),
            (e.ICE_CANDIDATE = 'iceCandidate'),
            (e.PEER_DATA_CHANNELS = 'peerDataChannels'),
            (e.PING = 'ping'),
            (e.WARNING = 'warning');
        })(t || (t = {}));
        class C {}
        class y extends C {}
        class T {
          constructor() {
            this.FromUEMessageHandlers = new Map();
          }
          addMessageHandler(e, t) {
            this.FromUEMessageHandlers.set(e, t);
          }
          handleMessage(e, t) {
            this.FromUEMessageHandlers.has(e)
              ? this.FromUEMessageHandlers.get(e)(t)
              : l.Error(
                  l.GetStackTrace(),
                  `Message type of ${e} does not have a message handler registered on the frontend - ignoring message.`,
                );
          }
          static setupDefaultHandlers(e) {
            e.signallingProtocol.addMessageHandler(t.PING, (s) => {
              const n = new g(new Date().getTime()).payload();
              l.Log(l.GetStackTrace(), t.PING + ': ' + s, 6),
                e.webSocket.send(n);
            }),
              e.signallingProtocol.addMessageHandler(t.CONFIG, (s) => {
                l.Log(l.GetStackTrace(), t.CONFIG, 6);
                const n = JSON.parse(s);
                e.onConfig(n);
              }),
              e.signallingProtocol.addMessageHandler(t.STREAMER_LIST, (s) => {
                l.Log(l.GetStackTrace(), t.STREAMER_LIST, 6);
                const n = JSON.parse(s);
                e.onStreamerList(n);
              }),
              e.signallingProtocol.addMessageHandler(t.PLAYER_COUNT, (e) => {
                l.Log(l.GetStackTrace(), t.PLAYER_COUNT, 6);
                const s = JSON.parse(e);
                l.Log(l.GetStackTrace(), 'Player Count: ' + s.count, 6);
              }),
              e.signallingProtocol.addMessageHandler(t.ANSWER, (s) => {
                l.Log(l.GetStackTrace(), t.ANSWER, 6);
                const n = JSON.parse(s);
                e.onWebRtcAnswer(n);
              }),
              e.signallingProtocol.addMessageHandler(t.OFFER, (s) => {
                l.Log(l.GetStackTrace(), t.OFFER, 6);
                const n = JSON.parse(s);
                e.onWebRtcOffer(n);
              }),
              e.signallingProtocol.addMessageHandler(t.ICE_CANDIDATE, (s) => {
                l.Log(l.GetStackTrace(), t.ICE_CANDIDATE, 6);
                const n = JSON.parse(s);
                e.onIceCandidate(n.candidate);
              }),
              e.signallingProtocol.addMessageHandler(t.WARNING, (e) => {
                l.Warning(l.GetStackTrace(), `Warning received: ${e}`);
              }),
              e.signallingProtocol.addMessageHandler(
                t.PEER_DATA_CHANNELS,
                (s) => {
                  l.Log(l.GetStackTrace(), t.PEER_DATA_CHANNELS, 6);
                  const n = JSON.parse(s);
                  e.onWebRtcPeerDataChannels(n);
                },
              );
          }
        }
        class E {
          constructor() {
            (this.WS_OPEN_STATE = 1),
              (this.onOpen = new EventTarget()),
              (this.onClose = new EventTarget()),
              (this.signallingProtocol = new T()),
              T.setupDefaultHandlers(this);
          }
          connect(e) {
            l.Log(l.GetStackTrace(), e, 6);
            try {
              return (
                (this.webSocket = new WebSocket(e)),
                (this.webSocket.onopen = (e) => this.handleOnOpen(e)),
                (this.webSocket.onerror = () => this.handleOnError()),
                (this.webSocket.onclose = (e) => this.handleOnClose(e)),
                (this.webSocket.onmessage = (e) => this.handleOnMessage(e)),
                (this.webSocket.onmessagebinary = (e) =>
                  this.handleOnMessageBinary(e)),
                !0
              );
            } catch (e) {
              return l.Error(e, e), !1;
            }
          }
          handleOnMessageBinary(e) {
            e &&
              e.data &&
              e.data
                .text()
                .then((e) => {
                  const t = new MessageEvent('messageFromBinary', { data: e });
                  this.handleOnMessage(t);
                })
                .catch((e) => {
                  l.Error(
                    l.GetStackTrace(),
                    `Failed to parse binary blob from websocket, reason: ${e}`,
                  );
                });
          }
          handleOnMessage(e) {
            if (e.data && e.data instanceof Blob)
              return void this.handleOnMessageBinary(e);
            const t = JSON.parse(e.data);
            l.Log(
              l.GetStackTrace(),
              'received => \n' + JSON.stringify(JSON.parse(e.data), void 0, 4),
              6,
            ),
              this.signallingProtocol.handleMessage(t.type, e.data);
          }
          handleOnOpen(e) {
            l.Log(
              l.GetStackTrace(),
              'Connected to the signalling server via WebSocket',
              6,
            ),
              this.onOpen.dispatchEvent(new Event('open'));
          }
          handleOnError() {
            l.Error(l.GetStackTrace(), 'WebSocket error');
          }
          handleOnClose(e) {
            this.onWebSocketOncloseOverlayMessage(e),
              l.Log(
                l.GetStackTrace(),
                'Disconnected to the signalling server via WebSocket: ' +
                  JSON.stringify(e.code) +
                  ' - ' +
                  e.reason,
              ),
              this.onClose.dispatchEvent(new Event('close'));
          }
          requestStreamerList() {
            const e = new c();
            this.webSocket.send(e.payload());
          }
          sendSubscribe(e) {
            const t = new h(e);
            this.webSocket.send(t.payload());
          }
          sendUnsubscribe() {
            const e = new u();
            this.webSocket.send(e.payload());
          }
          sendWebRtcOffer(e) {
            const t = new m(e);
            this.webSocket.send(t.payload());
          }
          sendWebRtcAnswer(e) {
            const t = new p(e);
            this.webSocket.send(t.payload());
          }
          sendWebRtcDatachannelRequest() {
            const e = new S();
            this.webSocket.send(e.payload());
          }
          sendSFURecvDataChannelReady() {
            const e = new v();
            this.webSocket.send(e.payload());
          }
          sendIceCandidate(e) {
            if (
              (l.Log(l.GetStackTrace(), 'Sending Ice Candidate'),
              this.webSocket &&
                this.webSocket.readyState === this.WS_OPEN_STATE)
            ) {
              const t = new f(e);
              this.webSocket.send(t.payload());
            }
          }
          close() {
            var e;
            null === (e = this.webSocket) || void 0 === e || e.close();
          }
          onWebSocketOncloseOverlayMessage(e) {}
          onConfig(e) {}
          onStreamerList(e) {}
          onIceCandidate(e) {}
          onWebRtcAnswer(e) {}
          onWebRtcOffer(e) {}
          onWebRtcPeerDataChannels(e) {}
        }
        class b {
          constructor(e) {
            (this.videoElementProvider = e),
              (this.audioElement = document.createElement('Audio'));
          }
          handleOnTrack(e) {
            l.Log(
              l.GetStackTrace(),
              'handleOnTrack ' + JSON.stringify(e.streams),
              6,
            );
            const t = this.videoElementProvider.getVideoElement();
            if (
              (e.track &&
                l.Log(
                  l.GetStackTrace(),
                  'Got track - ' +
                    e.track.kind +
                    ' id=' +
                    e.track.id +
                    ' readyState=' +
                    e.track.readyState,
                  6,
                ),
              'audio' != e.track.kind)
            )
              return 'video' == e.track.kind && t.srcObject !== e.streams[0]
                ? ((t.srcObject = e.streams[0]),
                  void l.Log(
                    l.GetStackTrace(),
                    'Set video source from video track ontrack.',
                  ))
                : void 0;
            this.CreateAudioTrack(e.streams[0]);
          }
          CreateAudioTrack(e) {
            const t = this.videoElementProvider.getVideoElement();
            t.srcObject != e &&
              t.srcObject &&
              t.srcObject !== e &&
              ((this.audioElement.srcObject = e),
              l.Log(
                l.GetStackTrace(),
                'Created new audio element to play separate audio stream.',
              ));
          }
        }
        class M {
          constructor(e) {
            (this.freezeFrameHeight = 0),
              (this.freezeFrameWidth = 0),
              (this.rootDiv = e),
              (this.rootElement = document.createElement('div')),
              (this.rootElement.id = 'freezeFrame'),
              (this.rootElement.style.display = 'none'),
              (this.rootElement.style.pointerEvents = 'none'),
              (this.rootElement.style.position = 'absolute'),
              (this.rootElement.style.zIndex = '20'),
              (this.imageElement = document.createElement('img')),
              (this.imageElement.style.position = 'absolute'),
              this.rootElement.appendChild(this.imageElement),
              this.rootDiv.appendChild(this.rootElement);
          }
          setElementForShow() {
            this.rootElement.style.display = 'block';
          }
          setElementForHide() {
            this.rootElement.style.display = 'none';
          }
          updateImageElementSource(e) {
            const t = btoa(e.reduce((e, t) => e + String.fromCharCode(t), ''));
            this.imageElement.src = 'data:image/jpeg;base64,' + t;
          }
          setDimensionsFromElementAndResize() {
            (this.freezeFrameHeight = this.imageElement.naturalHeight),
              (this.freezeFrameWidth = this.imageElement.naturalWidth),
              this.resize();
          }
          resize() {
            if (0 !== this.freezeFrameWidth && 0 !== this.freezeFrameHeight) {
              let e = 0,
                t = 0,
                s = 0,
                n = 0;
              const r = this.rootDiv.clientWidth / this.rootDiv.clientHeight,
                i = this.freezeFrameWidth / this.freezeFrameHeight;
              r < i
                ? ((e = this.rootDiv.clientWidth),
                  (t = Math.floor(this.rootDiv.clientWidth / i)),
                  (s = Math.floor(0.5 * (this.rootDiv.clientHeight - t))),
                  (n = 0))
                : ((e = Math.floor(this.rootDiv.clientHeight * i)),
                  (t = this.rootDiv.clientHeight),
                  (s = 0),
                  (n = Math.floor(0.5 * (this.rootDiv.clientWidth - e)))),
                (this.rootElement.style.width =
                  this.rootDiv.offsetWidth + 'px'),
                (this.rootElement.style.height =
                  this.rootDiv.offsetHeight + 'px'),
                (this.rootElement.style.left = '0px'),
                (this.rootElement.style.top = '0px'),
                (this.imageElement.style.width = e + 'px'),
                (this.imageElement.style.height = t + 'px'),
                (this.imageElement.style.left = n + 'px'),
                (this.imageElement.style.top = s + 'px');
            }
          }
        }
        class w {
          constructor(e) {
            (this.receiving = !1),
              (this.size = 0),
              (this.jpeg = void 0),
              (this.valid = !1),
              (this.freezeFrameDelay = 50),
              (this.freezeFrame = new M(e));
          }
          showFreezeFrame() {
            this.valid && this.freezeFrame.setElementForShow();
          }
          hideFreezeFrame() {
            (this.valid = !1), this.freezeFrame.setElementForHide();
          }
          updateFreezeFrameAndShow(e, t) {
            this.freezeFrame.updateImageElementSource(e),
              (this.freezeFrame.imageElement.onload = () => {
                this.freezeFrame.setDimensionsFromElementAndResize(), t();
              });
          }
          processFreezeFrameMessage(e, t) {
            this.receiving ||
              ((this.receiving = !0),
              (this.valid = !1),
              (this.size = 0),
              (this.jpeg = void 0)),
              (this.size = new DataView(e.slice(1, 5).buffer).getInt32(0, !0));
            const s = e.slice(5);
            if (this.jpeg) {
              const e = new Uint8Array(this.jpeg.length + s.length);
              e.set(this.jpeg, 0), e.set(s, this.jpeg.length), (this.jpeg = e);
            } else
              (this.jpeg = s),
                (this.receiving = !0),
                l.Log(
                  l.GetStackTrace(),
                  `received first chunk of freeze frame: ${this.jpeg.length}/${this.size}`,
                  6,
                );
            this.jpeg.length === this.size
              ? ((this.receiving = !1),
                (this.valid = !0),
                l.Log(
                  l.GetStackTrace(),
                  `received complete freeze frame ${this.size}`,
                  6,
                ),
                this.updateFreezeFrameAndShow(this.jpeg, t))
              : this.jpeg.length > this.size &&
                (l.Error(
                  l.GetStackTrace(),
                  `received bigger freeze frame than advertised: ${this.jpeg.length}/${this.size}`,
                ),
                (this.jpeg = void 0),
                (this.receiving = !1));
          }
        }
        class P {
          constructor(e, t, s, n, r = () => {}) {
            (this.onChange = r),
              (this.onChangeEmit = () => {}),
              (this.id = e),
              (this.description = s),
              (this.label = t),
              (this.value = n);
          }
          set label(e) {
            (this._label = e), this.onChangeEmit(this._value);
          }
          get label() {
            return this._label;
          }
          get value() {
            return this._value;
          }
          set value(e) {
            (this._value = e),
              this.onChange(this._value, this),
              this.onChangeEmit(this._value);
          }
        }
        class k extends P {
          constructor(e, t, s, n, r, i = () => {}) {
            super(e, t, s, n, i);
            const o = new URLSearchParams(window.location.search);
            if (r && o.has(this.id)) {
              const e = this.getUrlParamFlag();
              this.flag = e;
            } else this.flag = n;
            this.useUrlParams = r;
          }
          getUrlParamFlag() {
            const e = new URLSearchParams(window.location.search);
            return (
              !!e.has(this.id) &&
              'false' !== e.get(this.id) &&
              'False' !== e.get(this.id)
            );
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              !0 === this.flag
                ? e.set(this.id, 'true')
                : e.set(this.id, 'false'),
                window.history.replaceState(
                  {},
                  '',
                  '' !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`,
                );
            }
          }
          enable() {
            this.flag = !0;
          }
          get flag() {
            return !!this.value;
          }
          set flag(e) {
            this.value = e;
          }
        }
        class R extends P {
          constructor(e, t, s, n, r, i, o, a = () => {}) {
            super(e, t, s, i, a), (this._min = n), (this._max = r);
            const l = new URLSearchParams(window.location.search);
            if (o && l.has(this.id)) {
              const e = Number.parseInt(l.get(this.id));
              this.number = Number.isNaN(e) ? i : e;
            } else this.number = i;
            this.useUrlParams = o;
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              e.set(this.id, this.number.toString()),
                window.history.replaceState(
                  {},
                  '',
                  '' !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`,
                );
            }
          }
          set number(e) {
            this.value = this.clamp(e);
          }
          get number() {
            return this.value;
          }
          clamp(e) {
            return Math.max(Math.min(this._max, e), this._min);
          }
          get min() {
            return this._min;
          }
          get max() {
            return this._max;
          }
          addOnChangedListener(e) {
            this.onChange = e;
          }
        }
        class L extends P {
          constructor(e, t, s, n, r, i = () => {}) {
            super(e, t, s, n, i);
            const o = new URLSearchParams(window.location.search);
            if (r && o.has(this.id)) {
              const e = this.getUrlParamText();
              this.text = e;
            } else this.text = n;
            this.useUrlParams = r;
          }
          getUrlParamText() {
            var e;
            const t = new URLSearchParams(window.location.search);
            return t.has(this.id) &&
              null !== (e = t.get(this.id)) &&
              void 0 !== e
              ? e
              : '';
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              e.set(this.id, this.text),
                window.history.replaceState(
                  {},
                  '',
                  '' !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`,
                );
            }
          }
          get text() {
            return this.value;
          }
          set text(e) {
            this.value = e;
          }
        }
        class x extends P {
          constructor(e, t, s, n, r, i, o = () => {}) {
            super(e, t, s, [n, n], o), (this.options = r);
            const a = new URLSearchParams(window.location.search),
              l = i && a.has(this.id) ? this.getUrlParamText() : n;
            (this.selected = l), (this.useUrlParams = i);
          }
          getUrlParamText() {
            var e;
            const t = new URLSearchParams(window.location.search);
            return t.has(this.id) &&
              null !== (e = t.get(this.id)) &&
              void 0 !== e
              ? e
              : '';
          }
          updateURLParams() {
            if (this.useUrlParams) {
              const e = new URLSearchParams(window.location.search);
              e.set(this.id, this.selected),
                window.history.replaceState(
                  {},
                  '',
                  '' !== e.toString()
                    ? `${location.pathname}?${e}`
                    : `${location.pathname}`,
                );
            }
          }
          addOnChangedListener(e) {
            this.onChange = e;
          }
          get options() {
            return this._options;
          }
          set options(e) {
            (this._options = e), this.onChangeEmit(this.selected);
          }
          get selected() {
            return this.value;
          }
          set selected(e) {
            const t = this.options.filter((t) => -1 !== t.indexOf(e));
            t.length && (this.value = t[0]);
          }
        }
        class F extends Event {
          constructor(e) {
            super('afkWarningActivate'), (this.data = e);
          }
        }
        class A extends Event {
          constructor(e) {
            super('afkWarningUpdate'), (this.data = e);
          }
        }
        class D extends Event {
          constructor() {
            super('afkWarningDeactivate');
          }
        }
        class O extends Event {
          constructor() {
            super('afkTimedOut');
          }
        }
        class I extends Event {
          constructor(e) {
            super('videoEncoderAvgQP'), (this.data = e);
          }
        }
        class U extends Event {
          constructor() {
            super('webRtcSdp');
          }
        }
        class G extends Event {
          constructor() {
            super('webRtcAutoConnect');
          }
        }
        class z extends Event {
          constructor() {
            super('webRtcConnecting');
          }
        }
        class B extends Event {
          constructor() {
            super('webRtcConnected');
          }
        }
        class _ extends Event {
          constructor() {
            super('webRtcFailed');
          }
        }
        class H extends Event {
          constructor(e) {
            super('webRtcDisconnected'), (this.data = e);
          }
        }
        class V extends Event {
          constructor(e) {
            super('dataChannelOpen'), (this.data = e);
          }
        }
        class W extends Event {
          constructor(e) {
            super('dataChannelClose'), (this.data = e);
          }
        }
        class N extends Event {
          constructor(e) {
            super('dataChannelError'), (this.data = e);
          }
        }
        class K extends Event {
          constructor() {
            super('videoInitialized');
          }
        }
        class Q extends Event {
          constructor() {
            super('streamLoading');
          }
        }
        class $ extends Event {
          constructor() {
            super('streamConnect');
          }
        }
        class q extends Event {
          constructor() {
            super('streamDisconnect');
          }
        }
        class X extends Event {
          constructor() {
            super('streamReconnect');
          }
        }
        class j extends Event {
          constructor(e) {
            super('playStreamError'), (this.data = e);
          }
        }
        class J extends Event {
          constructor() {
            super('playStream');
          }
        }
        class Y extends Event {
          constructor(e) {
            super('playStreamRejected'), (this.data = e);
          }
        }
        class Z extends Event {
          constructor(e) {
            super('loadFreezeFrame'), (this.data = e);
          }
        }
        class ee extends Event {
          constructor() {
            super('hideFreezeFrame');
          }
        }
        class te extends Event {
          constructor(e) {
            super('statsReceived'), (this.data = e);
          }
        }
        class se extends Event {
          constructor(e) {
            super('streamerListMessage'), (this.data = e);
          }
        }
        class ne extends Event {
          constructor(e) {
            super('latencyTestResult'), (this.data = e);
          }
        }
        class re extends Event {
          constructor(e) {
            super('initialSettings'), (this.data = e);
          }
        }
        class ie extends Event {
          constructor(e) {
            super('settingsChanged'), (this.data = e);
          }
        }
        class oe extends Event {
          constructor() {
            super('xrSessionStarted');
          }
        }
        class ae extends Event {
          constructor() {
            super('xrSessionEnded');
          }
        }
        class le extends Event {
          constructor(e) {
            super('xrFrame'), (this.data = e);
          }
        }
        class de extends EventTarget {
          dispatchEvent(e) {
            return super.dispatchEvent(e);
          }
          addEventListener(e, t) {
            super.addEventListener(e, t);
          }
          removeEventListener(e, t) {
            super.removeEventListener(e, t);
          }
        }
        class ce {}
        (ce.AutoConnect = 'AutoConnect'),
          (ce.AutoPlayVideo = 'AutoPlayVideo'),
          (ce.AFKDetection = 'TimeoutIfIdle'),
          (ce.BrowserSendOffer = 'OfferToReceive'),
          (ce.HoveringMouseMode = 'HoveringMouse'),
          (ce.ForceMonoAudio = 'ForceMonoAudio'),
          (ce.ForceTURN = 'ForceTURN'),
          (ce.FakeMouseWithTouches = 'FakeMouseWithTouches'),
          (ce.IsQualityController = 'ControlsQuality'),
          (ce.MatchViewportResolution = 'MatchViewportRes'),
          (ce.PreferSFU = 'preferSFU'),
          (ce.StartVideoMuted = 'StartVideoMuted'),
          (ce.SuppressBrowserKeys = 'SuppressBrowserKeys'),
          (ce.UseMic = 'UseMic'),
          (ce.KeyboardInput = 'KeyboardInput'),
          (ce.MouseInput = 'MouseInput'),
          (ce.TouchInput = 'TouchInput'),
          (ce.GamepadInput = 'GamepadInput'),
          (ce.XRControllerInput = 'XRControllerInput');
        const he = (e) =>
          Object.getOwnPropertyNames(ce).some((t) => ce[t] === e);
        class ue {}
        (ue.AFKTimeoutSecs = 'AFKTimeout'),
          (ue.MinQP = 'MinQP'),
          (ue.MaxQP = 'MaxQP'),
          (ue.WebRTCFPS = 'WebRTCFPS'),
          (ue.WebRTCMinBitrate = 'WebRTCMinBitrate'),
          (ue.WebRTCMaxBitrate = 'WebRTCMaxBitrate'),
          (ue.MaxReconnectAttempts = 'MaxReconnectAttempts');
        const ge = (e) =>
          Object.getOwnPropertyNames(ue).some((t) => ue[t] === e);
        class me {}
        me.SignallingServerUrl = 'ss';
        const pe = (e) =>
          Object.getOwnPropertyNames(me).some((t) => me[t] === e);
        class Se {}
        (Se.PreferredCodec = 'PreferredCodec'), (Se.StreamerId = 'StreamerId');
        const ve = (e) =>
          Object.getOwnPropertyNames(Se).some((t) => Se[t] === e);
        class fe {
          constructor(e = {}) {
            (this.flags = new Map()),
              (this.numericParameters = new Map()),
              (this.textParameters = new Map()),
              (this.optionParameters = new Map());
            const { initialSettings: t, useUrlParams: s } = e;
            (this._useUrlParams = !!s),
              this.populateDefaultSettings(this._useUrlParams),
              t && this.setSettings(t);
          }
          get useUrlParams() {
            return this._useUrlParams;
          }
          populateDefaultSettings(e) {
            this.textParameters.set(
              me.SignallingServerUrl,
              new L(
                me.SignallingServerUrl,
                'Signalling url',
                'Url of the signalling server',
                ('https:' === location.protocol ? 'wss://' : 'ws://') +
                  window.location.hostname +
                  ('80' === window.location.port || '' === window.location.port
                    ? ''
                    : `:${window.location.port}`),
                e,
              ),
            ),
              this.optionParameters.set(
                Se.StreamerId,
                new x(
                  Se.StreamerId,
                  'Streamer ID',
                  'The ID of the streamer to stream.',
                  '',
                  [],
                  e,
                ),
              ),
              this.optionParameters.set(
                Se.PreferredCodec,
                new x(
                  Se.PreferredCodec,
                  'Preferred Codec',
                  'The preferred codec to be used during codec negotiation',
                  'H264 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f',
                  (function () {
                    const e = [];
                    if (!RTCRtpReceiver.getCapabilities)
                      return e.push('Only available on Chrome'), e;
                    const t = /(VP\d|H26\d|AV1).*/;
                    return (
                      RTCRtpReceiver.getCapabilities('video').codecs.forEach(
                        (s) => {
                          const n =
                            s.mimeType.split('/')[1] +
                            ' ' +
                            (s.sdpFmtpLine || '');
                          null !== t.exec(n) && e.push(n);
                        },
                      ),
                      e
                    );
                  })(),
                  e,
                ),
              ),
              this.flags.set(
                ce.AutoConnect,
                new k(
                  ce.AutoConnect,
                  'Auto connect to stream',
                  'Whether we should attempt to auto connect to the signalling server or show a click to start prompt.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.AutoPlayVideo,
                new k(
                  ce.AutoPlayVideo,
                  'Auto play video',
                  'When video is ready automatically start playing it as opposed to showing a play button.',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.BrowserSendOffer,
                new k(
                  ce.BrowserSendOffer,
                  'Browser send offer',
                  'Browser will initiate the WebRTC handshake by sending the offer to the streamer',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.UseMic,
                new k(
                  ce.UseMic,
                  'Use microphone',
                  'Make browser request microphone access and open an input audio track.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.StartVideoMuted,
                new k(
                  ce.StartVideoMuted,
                  'Start video muted',
                  'Video will start muted if true.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.SuppressBrowserKeys,
                new k(
                  ce.SuppressBrowserKeys,
                  'Suppress browser keys',
                  'Suppress certain browser keys that we use in UE, for example F5 to show shader complexity instead of refresh the page.',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.PreferSFU,
                new k(
                  ce.PreferSFU,
                  'Prefer SFU',
                  'Try to connect to the SFU instead of P2P.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.IsQualityController,
                new k(
                  ce.IsQualityController,
                  'Is quality controller?',
                  'True if this peer controls stream quality',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.ForceMonoAudio,
                new k(
                  ce.ForceMonoAudio,
                  'Force mono audio',
                  'Force browser to request mono audio in the SDP',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.ForceTURN,
                new k(
                  ce.ForceTURN,
                  'Force TURN',
                  'Only generate TURN/Relayed ICE candidates.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.AFKDetection,
                new k(
                  ce.AFKDetection,
                  'AFK if idle',
                  'Timeout the experience if user is AFK for a period.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.MatchViewportResolution,
                new k(
                  ce.MatchViewportResolution,
                  'Match viewport resolution',
                  'Pixel Streaming will be instructed to dynamically resize the video stream to match the size of the video element.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.HoveringMouseMode,
                new k(
                  ce.HoveringMouseMode,
                  'Control Scheme: Locked Mouse',
                  'Either locked mouse, where the pointer is consumed by the video and locked to it, or hovering mouse, where the mouse is not consumed.',
                  !1,
                  e,
                  (e, t) => {
                    t.label = `Control Scheme: ${
                      e ? 'Hovering' : 'Locked'
                    } Mouse`;
                  },
                ),
              ),
              this.flags.set(
                ce.FakeMouseWithTouches,
                new k(
                  ce.FakeMouseWithTouches,
                  'Fake mouse with touches',
                  'A single finger touch is converted into a mouse event. This allows a non-touch application to be controlled partially via a touch device.',
                  !1,
                  e,
                ),
              ),
              this.flags.set(
                ce.KeyboardInput,
                new k(
                  ce.KeyboardInput,
                  'Keyboard input',
                  'If enabled, send keyboard events to streamer',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.MouseInput,
                new k(
                  ce.MouseInput,
                  'Mouse input',
                  'If enabled, send mouse events to streamer',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.TouchInput,
                new k(
                  ce.TouchInput,
                  'Touch input',
                  'If enabled, send touch events to streamer',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.GamepadInput,
                new k(
                  ce.GamepadInput,
                  'Gamepad input',
                  'If enabled, send gamepad events to streamer',
                  !0,
                  e,
                ),
              ),
              this.flags.set(
                ce.XRControllerInput,
                new k(
                  ce.XRControllerInput,
                  'XR controller input',
                  'If enabled, send XR controller events to streamer',
                  !0,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.AFKTimeoutSecs,
                new R(
                  ue.AFKTimeoutSecs,
                  'AFK timeout',
                  'The time (in seconds) it takes for the application to time out if AFK timeout is enabled.',
                  0,
                  600,
                  120,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.MaxReconnectAttempts,
                new R(
                  ue.MaxReconnectAttempts,
                  'Max Reconnects',
                  'Maximum number of reconnects the application will attempt when a streamer disconnects.',
                  0,
                  999,
                  3,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.MinQP,
                new R(
                  ue.MinQP,
                  'Min QP',
                  'The lower bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.',
                  0,
                  51,
                  0,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.MaxQP,
                new R(
                  ue.MaxQP,
                  'Max QP',
                  'The upper bound for the quantization parameter (QP) of the encoder. 0 = Best quality, 51 = worst quality.',
                  0,
                  51,
                  51,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.WebRTCFPS,
                new R(
                  ue.WebRTCFPS,
                  'Max FPS',
                  'The maximum FPS that WebRTC will try to transmit frames at.',
                  1,
                  999,
                  60,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.WebRTCMinBitrate,
                new R(
                  ue.WebRTCMinBitrate,
                  'Min Bitrate (kbps)',
                  'The minimum bitrate that WebRTC should use.',
                  0,
                  5e5,
                  0,
                  e,
                ),
              ),
              this.numericParameters.set(
                ue.WebRTCMaxBitrate,
                new R(
                  ue.WebRTCMaxBitrate,
                  'Max Bitrate (kbps)',
                  'The maximum bitrate that WebRTC should use.',
                  0,
                  5e5,
                  0,
                  e,
                ),
              );
          }
          _addOnNumericSettingChangedListener(e, t) {
            this.numericParameters.has(e) &&
              this.numericParameters.get(e).addOnChangedListener(t);
          }
          _addOnOptionSettingChangedListener(e, t) {
            this.optionParameters.has(e) &&
              this.optionParameters.get(e).addOnChangedListener(t);
          }
          getNumericSettingValue(e) {
            if (this.numericParameters.has(e))
              return this.numericParameters.get(e).number;
            throw new Error(`There is no numeric setting with the id of ${e}`);
          }
          getTextSettingValue(e) {
            if (this.textParameters.has(e))
              return this.textParameters.get(e).value;
            throw new Error(`There is no numeric setting with the id of ${e}`);
          }
          setNumericSetting(e, t) {
            if (!this.numericParameters.has(e))
              throw new Error(
                `There is no numeric setting with the id of ${e}`,
              );
            this.numericParameters.get(e).number = t;
          }
          _addOnSettingChangedListener(e, t) {
            this.flags.has(e) && (this.flags.get(e).onChange = t);
          }
          _addOnTextSettingChangedListener(e, t) {
            this.textParameters.has(e) &&
              (this.textParameters.get(e).onChange = t);
          }
          getSettingOption(e) {
            return this.optionParameters.get(e);
          }
          isFlagEnabled(e) {
            return this.flags.get(e).flag;
          }
          setFlagEnabled(e, t) {
            this.flags.has(e)
              ? (this.flags.get(e).flag = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot toggle flag called ${e} - it does not exist in the Config.flags map.`,
                );
          }
          setTextSetting(e, t) {
            this.textParameters.has(e)
              ? (this.textParameters.get(e).text = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set text setting called ${e} - it does not exist in the Config.textParameters map.`,
                );
          }
          setOptionSettingOptions(e, t) {
            this.optionParameters.has(e)
              ? (this.optionParameters.get(e).options = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set text setting called ${e} - it does not exist in the Config.optionParameters map.`,
                );
          }
          setOptionSettingValue(e, t) {
            this.optionParameters.has(e)
              ? (this.optionParameters.get(e).selected = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set text setting called ${e} - it does not exist in the Config.enumParameters map.`,
                );
          }
          setFlagLabel(e, t) {
            this.flags.has(e)
              ? (this.flags.get(e).label = t)
              : l.Warning(
                  l.GetStackTrace(),
                  `Cannot set label for flag called ${e} - it does not exist in the Config.flags map.`,
                );
          }
          setSettings(e) {
            for (const t of Object.keys(e))
              he(t)
                ? this.setFlagEnabled(t, e[t])
                : ge(t)
                ? this.setNumericSetting(t, e[t])
                : pe(t)
                ? this.setTextSetting(t, e[t])
                : ve(t) && this.setOptionSettingValue(t, e[t]);
          }
          getSettings() {
            const e = {};
            for (const [t, s] of this.flags.entries()) e[t] = s.flag;
            for (const [t, s] of this.numericParameters.entries())
              e[t] = s.number;
            for (const [t, s] of this.textParameters.entries()) e[t] = s.text;
            for (const [t, s] of this.optionParameters.entries())
              e[t] = s.selected;
            return e;
          }
          getFlags() {
            return Array.from(this.flags.values());
          }
          getTextSettings() {
            return Array.from(this.textParameters.values());
          }
          getNumericSettings() {
            return Array.from(this.numericParameters.values());
          }
          getOptionSettings() {
            return Array.from(this.optionParameters.values());
          }
          _registerOnChangeEvents(e) {
            for (const t of this.flags.keys()) {
              const s = this.flags.get(t);
              s &&
                (s.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new ie({ id: s.id, type: 'flag', value: t, target: s }),
                  ));
            }
            for (const t of this.numericParameters.keys()) {
              const s = this.numericParameters.get(t);
              s &&
                (s.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new ie({ id: s.id, type: 'number', value: t, target: s }),
                  ));
            }
            for (const t of this.textParameters.keys()) {
              const s = this.textParameters.get(t);
              s &&
                (s.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new ie({ id: s.id, type: 'text', value: t, target: s }),
                  ));
            }
            for (const t of this.optionParameters.keys()) {
              const s = this.optionParameters.get(t);
              s &&
                (s.onChangeEmit = (t) =>
                  e.dispatchEvent(
                    new ie({ id: s.id, type: 'option', value: t, target: s }),
                  ));
            }
          }
        }
        var Ce;
        !(function (e) {
          (e[(e.LockedMouse = 0)] = 'LockedMouse'),
            (e[(e.HoveringMouse = 1)] = 'HoveringMouse');
        })(Ce || (Ce = {}));
        class ye {
          constructor(e, t, s) {
            (this.closeTimeout = 10),
              (this.active = !1),
              (this.countdownActive = !1),
              (this.warnTimer = void 0),
              (this.countDown = 0),
              (this.countDownTimer = void 0),
              (this.config = e),
              (this.pixelStreaming = t),
              (this.onDismissAfk = s),
              (this.onAFKTimedOutCallback = () => {
                console.log(
                  'AFK timed out, did you want to override this callback?',
                );
              });
          }
          onAfkClick() {
            clearInterval(this.countDownTimer),
              (this.active || this.countdownActive) &&
                (this.startAfkWarningTimer(),
                this.pixelStreaming.dispatchEvent(new D()));
          }
          startAfkWarningTimer() {
            this.config.getNumericSettingValue(ue.AFKTimeoutSecs) > 0 &&
            this.config.isFlagEnabled(ce.AFKDetection)
              ? (this.active = !0)
              : (this.active = !1),
              this.resetAfkWarningTimer();
          }
          stopAfkWarningTimer() {
            (this.active = !1),
              (this.countdownActive = !1),
              clearTimeout(this.warnTimer),
              clearInterval(this.countDownTimer);
          }
          pauseAfkWarningTimer() {
            this.active = !1;
          }
          resetAfkWarningTimer() {
            this.active &&
              this.config.isFlagEnabled(ce.AFKDetection) &&
              (clearTimeout(this.warnTimer),
              (this.warnTimer = setTimeout(
                () => this.activateAfkEvent(),
                1e3 * this.config.getNumericSettingValue(ue.AFKTimeoutSecs),
              )));
          }
          activateAfkEvent() {
            this.pauseAfkWarningTimer(),
              this.pixelStreaming.dispatchEvent(
                new F({
                  countDown: this.countDown,
                  dismissAfk: this.onDismissAfk,
                }),
              ),
              (this.countDown = this.closeTimeout),
              (this.countdownActive = !0),
              this.pixelStreaming.dispatchEvent(
                new A({ countDown: this.countDown }),
              ),
              this.config.isFlagEnabled(ce.HoveringMouseMode) ||
                (document.exitPointerLock && document.exitPointerLock()),
              (this.countDownTimer = setInterval(() => {
                this.countDown--,
                  0 == this.countDown
                    ? (this.pixelStreaming.dispatchEvent(new O()),
                      this.onAFKTimedOutCallback(),
                      l.Log(
                        l.GetStackTrace(),
                        'You have been disconnected due to inactivity',
                      ),
                      this.stopAfkWarningTimer())
                    : this.pixelStreaming.dispatchEvent(
                        new A({ countDown: this.countDown }),
                      );
              }, 1e3));
          }
        }
        class Te {
          constructor() {
            this.isReceivingFreezeFrame = !1;
          }
          getDataChannelInstance() {
            return this;
          }
          createDataChannel(e, t, s) {
            (this.peerConnection = e),
              (this.label = t),
              (this.datachannelOptions = s),
              null == s &&
                ((this.datachannelOptions = {}),
                (this.datachannelOptions.ordered = !0)),
              (this.dataChannel = this.peerConnection.createDataChannel(
                this.label,
                this.datachannelOptions,
              )),
              this.setupDataChannel();
          }
          setupDataChannel() {
            (this.dataChannel.binaryType = 'arraybuffer'),
              (this.dataChannel.onopen = (e) => this.handleOnOpen(e)),
              (this.dataChannel.onclose = (e) => this.handleOnClose(e)),
              (this.dataChannel.onmessage = (e) => this.handleOnMessage(e)),
              (this.dataChannel.onerror = (e) => this.handleOnError(e));
          }
          handleOnOpen(e) {
            var t;
            l.Log(l.GetStackTrace(), `Data Channel (${this.label}) opened.`, 7),
              this.onOpen(
                null === (t = this.dataChannel) || void 0 === t
                  ? void 0
                  : t.label,
                e,
              );
          }
          handleOnClose(e) {
            var t;
            l.Log(l.GetStackTrace(), `Data Channel (${this.label}) closed.`, 7),
              this.onClose(
                null === (t = this.dataChannel) || void 0 === t
                  ? void 0
                  : t.label,
                e,
              );
          }
          handleOnMessage(e) {
            l.Log(
              l.GetStackTrace(),
              `Data Channel (${this.label}) message: ${e}`,
              8,
            );
          }
          handleOnError(e) {
            var t;
            l.Log(
              l.GetStackTrace(),
              `Data Channel (${this.label}) error: ${e}`,
              7,
            ),
              this.onError(
                null === (t = this.dataChannel) || void 0 === t
                  ? void 0
                  : t.label,
                e,
              );
          }
          onOpen(e, t) {}
          onClose(e, t) {}
          onError(e, t) {}
        }
        class Ee {}
        class be {}
        class Me {}
        class we {}
        class Pe {}
        class ke {}
        class Re {}
        class Le {}
        class xe {
          constructor() {
            (this.inboundVideoStats = new be()),
              (this.inboundAudioStats = new Ee()),
              (this.candidatePair = new Pe()),
              (this.DataChannelStats = new Me()),
              (this.outBoundVideoStats = new ke()),
              (this.sessionStats = new Re()),
              (this.streamStats = new Le()),
              (this.codecs = new Map());
          }
          processStats(e) {
            (this.localCandidates = new Array()),
              (this.remoteCandidates = new Array()),
              e.forEach((e) => {
                switch (e.type) {
                  case 'candidate-pair':
                    this.handleCandidatePair(e);
                    break;
                  case 'certificate':
                  case 'media-source':
                  case 'media-playout':
                  case 'outbound-rtp':
                  case 'peer-connection':
                  case 'remote-inbound-rtp':
                  case 'transport':
                    break;
                  case 'codec':
                    this.handleCodec(e);
                    break;
                  case 'data-channel':
                    this.handleDataChannel(e);
                    break;
                  case 'inbound-rtp':
                    this.handleInBoundRTP(e);
                    break;
                  case 'local-candidate':
                    this.handleLocalCandidate(e);
                    break;
                  case 'remote-candidate':
                    this.handleRemoteCandidate(e);
                    break;
                  case 'remote-outbound-rtp':
                    this.handleRemoteOutBound(e);
                    break;
                  case 'track':
                    this.handleTrack(e);
                    break;
                  case 'stream':
                    this.handleStream(e);
                    break;
                  default:
                    l.Error(l.GetStackTrace(), 'unhandled Stat Type'),
                      l.Log(l.GetStackTrace(), e);
                }
              });
          }
          handleStream(e) {
            this.streamStats = e;
          }
          handleCandidatePair(e) {
            (this.candidatePair.bytesReceived = e.bytesReceived),
              (this.candidatePair.bytesSent = e.bytesSent),
              (this.candidatePair.localCandidateId = e.localCandidateId),
              (this.candidatePair.remoteCandidateId = e.remoteCandidateId),
              (this.candidatePair.nominated = e.nominated),
              (this.candidatePair.readable = e.readable),
              (this.candidatePair.selected = e.selected),
              (this.candidatePair.writable = e.writable),
              (this.candidatePair.state = e.state),
              (this.candidatePair.currentRoundTripTime =
                e.currentRoundTripTime);
          }
          handleDataChannel(e) {
            (this.DataChannelStats.bytesReceived = e.bytesReceived),
              (this.DataChannelStats.bytesSent = e.bytesSent),
              (this.DataChannelStats.dataChannelIdentifier =
                e.dataChannelIdentifier),
              (this.DataChannelStats.id = e.id),
              (this.DataChannelStats.label = e.label),
              (this.DataChannelStats.messagesReceived = e.messagesReceived),
              (this.DataChannelStats.messagesSent = e.messagesSent),
              (this.DataChannelStats.protocol = e.protocol),
              (this.DataChannelStats.state = e.state),
              (this.DataChannelStats.timestamp = e.timestamp);
          }
          handleLocalCandidate(e) {
            const t = new we();
            (t.label = 'local-candidate'),
              (t.address = e.address),
              (t.port = e.port),
              (t.protocol = e.protocol),
              (t.candidateType = e.candidateType),
              (t.id = e.id),
              this.localCandidates.push(t);
          }
          handleRemoteCandidate(e) {
            const t = new we();
            (t.label = 'local-candidate'),
              (t.address = e.address),
              (t.port = e.port),
              (t.protocol = e.protocol),
              (t.id = e.id),
              (t.candidateType = e.candidateType),
              this.remoteCandidates.push(t);
          }
          handleInBoundRTP(e) {
            switch (e.kind) {
              case 'video':
                (this.inboundVideoStats = e),
                  null != this.lastVideoStats &&
                    ((this.inboundVideoStats.bitrate =
                      (8 *
                        (this.inboundVideoStats.bytesReceived -
                          this.lastVideoStats.bytesReceived)) /
                      (this.inboundVideoStats.timestamp -
                        this.lastVideoStats.timestamp)),
                    (this.inboundVideoStats.bitrate = Math.floor(
                      this.inboundVideoStats.bitrate,
                    ))),
                  (this.lastVideoStats = Object.assign(
                    {},
                    this.inboundVideoStats,
                  ));
                break;
              case 'audio':
                (this.inboundAudioStats = e),
                  null != this.lastAudioStats &&
                    ((this.inboundAudioStats.bitrate =
                      (8 *
                        (this.inboundAudioStats.bytesReceived -
                          this.lastAudioStats.bytesReceived)) /
                      (this.inboundAudioStats.timestamp -
                        this.lastAudioStats.timestamp)),
                    (this.inboundAudioStats.bitrate = Math.floor(
                      this.inboundAudioStats.bitrate,
                    ))),
                  (this.lastAudioStats = Object.assign(
                    {},
                    this.inboundAudioStats,
                  ));
                break;
              default:
                l.Log(l.GetStackTrace(), 'Kind is not handled');
            }
          }
          handleRemoteOutBound(e) {
            'video' === e.kind &&
              ((this.outBoundVideoStats.bytesSent = e.bytesSent),
              (this.outBoundVideoStats.id = e.id),
              (this.outBoundVideoStats.localId = e.localId),
              (this.outBoundVideoStats.packetsSent = e.packetsSent),
              (this.outBoundVideoStats.remoteTimestamp = e.remoteTimestamp),
              (this.outBoundVideoStats.timestamp = e.timestamp));
          }
          handleTrack(e) {
            'track' !== e.type ||
              ('video_label' !== e.trackIdentifier && 'video' !== e.kind) ||
              ((this.inboundVideoStats.framesDropped = e.framesDropped),
              (this.inboundVideoStats.framesReceived = e.framesReceived),
              (this.inboundVideoStats.frameHeight = e.frameHeight),
              (this.inboundVideoStats.frameWidth = e.frameWidth));
          }
          handleCodec(e) {
            const t = e.id,
              s = `${e.mimeType.replace('video/', '').replace('audio/', '')}${
                e.sdpFmtpLine ? ` ${e.sdpFmtpLine}` : ''
              }`;
            this.codecs.set(t, s);
          }
          handleSessionStatistics(e, t, s) {
            const n = Date.now() - e;
            this.sessionStats.runTime = new Date(n)
              .toISOString()
              .substr(11, 8)
              .toString();
            const r = null === t ? 'Not sent yet' : t ? 'true' : 'false';
            (this.sessionStats.controlsStreamInput = r),
              (this.sessionStats.videoEncoderAvgQP = s);
          }
          isNumber(e) {
            return 'number' == typeof e && isFinite(e);
          }
        }
        const Fe =
          ((Ae = {
            parseRtpParameters: () => i.parseRtpParameters,
            splitSections: () => i.splitSections,
          }),
          (De = {}),
          o.d(De, Ae),
          De);
        var Ae,
          De,
          Oe,
          Ie,
          Ue = function (e, t, s, n) {
            return new (s || (s = Promise))(function (r, i) {
              function o(e) {
                try {
                  l(n.next(e));
                } catch (e) {
                  i(e);
                }
              }
              function a(e) {
                try {
                  l(n.throw(e));
                } catch (e) {
                  i(e);
                }
              }
              function l(e) {
                var t;
                e.done
                  ? r(e.value)
                  : ((t = e.value),
                    t instanceof s
                      ? t
                      : new s(function (e) {
                          e(t);
                        })).then(o, a);
              }
              l((n = n.apply(e, t || [])).next());
            });
          };
        class Ge {
          constructor(e, t, s) {
            (this.config = t), this.createPeerConnection(e, s);
          }
          createPeerConnection(e, t) {
            this.config.isFlagEnabled(ce.ForceTURN) &&
              ((e.iceTransportPolicy = 'relay'),
              l.Log(
                l.GetStackTrace(),
                'Forcing TURN usage by setting ICE Transport Policy in peer connection config.',
              )),
              (this.peerConnection = new RTCPeerConnection(e)),
              (this.peerConnection.onsignalingstatechange = (e) =>
                this.handleSignalStateChange(e)),
              (this.peerConnection.oniceconnectionstatechange = (e) =>
                this.handleIceConnectionStateChange(e)),
              (this.peerConnection.onicegatheringstatechange = (e) =>
                this.handleIceGatheringStateChange(e)),
              (this.peerConnection.ontrack = (e) => this.handleOnTrack(e)),
              (this.peerConnection.onicecandidate = (e) =>
                this.handleIceCandidate(e)),
              (this.peerConnection.ondatachannel = (e) =>
                this.handleDataChannel(e)),
              (this.aggregatedStats = new xe()),
              (this.preferredCodec = t),
              (this.updateCodecSelection = !0);
          }
          createOffer(e, t) {
            return Ue(this, void 0, void 0, function* () {
              l.Log(l.GetStackTrace(), 'Create Offer', 6);
              const s =
                  'localhost' === location.hostname ||
                  '127.0.0.1' === location.hostname,
                n = 'https:' === location.protocol;
              let r = t.isFlagEnabled(ce.UseMic);
              !r ||
                s ||
                n ||
                ((r = !1),
                l.Error(
                  l.GetStackTrace(),
                  'Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access.',
                ),
                l.Error(
                  l.GetStackTrace(),
                  "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'",
                )),
                this.setupTransceiversAsync(r).finally(() => {
                  var t;
                  null === (t = this.peerConnection) ||
                    void 0 === t ||
                    t
                      .createOffer(e)
                      .then((e) => {
                        var t;
                        this.showTextOverlayConnecting(),
                          (e.sdp = this.mungeSDP(e.sdp, r)),
                          null === (t = this.peerConnection) ||
                            void 0 === t ||
                            t.setLocalDescription(e),
                          this.onSendWebRTCOffer(e);
                      })
                      .catch(() => {
                        this.showTextOverlaySetupFailure();
                      });
                });
            });
          }
          receiveOffer(e, t) {
            var s;
            return Ue(this, void 0, void 0, function* () {
              l.Log(l.GetStackTrace(), 'Receive Offer', 6),
                null === (s = this.peerConnection) ||
                  void 0 === s ||
                  s.setRemoteDescription(e).then(() => {
                    const e =
                        'localhost' === location.hostname ||
                        '127.0.0.1' === location.hostname,
                      s = 'https:' === location.protocol;
                    let n = t.isFlagEnabled(ce.UseMic);
                    !n ||
                      e ||
                      s ||
                      ((n = !1),
                      l.Error(
                        l.GetStackTrace(),
                        'Microphone access in the browser will not work if you are not on HTTPS or localhost. Disabling mic access.',
                      ),
                      l.Error(
                        l.GetStackTrace(),
                        "For testing you can enable HTTP microphone access Chrome by visiting chrome://flags/ and enabling 'unsafely-treat-insecure-origin-as-secure'",
                      )),
                      this.setupTransceiversAsync(n).finally(() => {
                        var e;
                        null === (e = this.peerConnection) ||
                          void 0 === e ||
                          e
                            .createAnswer()
                            .then((e) => {
                              var t;
                              return (
                                (e.sdp = this.mungeSDP(e.sdp, n)),
                                null === (t = this.peerConnection) ||
                                void 0 === t
                                  ? void 0
                                  : t.setLocalDescription(e)
                              );
                            })
                            .then(() => {
                              var e;
                              this.onSendWebRTCAnswer(
                                null === (e = this.peerConnection) ||
                                  void 0 === e
                                  ? void 0
                                  : e.currentLocalDescription,
                              );
                            })
                            .catch(() => {
                              l.Error(
                                l.GetStackTrace(),
                                'createAnswer() failed',
                              );
                            });
                      });
                  }),
                this.config.setOptionSettingOptions(
                  Se.PreferredCodec,
                  this.parseAvailableCodecs(e).filter((e) =>
                    this.config
                      .getSettingOption(Se.PreferredCodec)
                      .options.includes(e),
                  ),
                );
            });
          }
          receiveAnswer(e) {
            var t;
            null === (t = this.peerConnection) ||
              void 0 === t ||
              t.setRemoteDescription(e),
              this.config.setOptionSettingOptions(
                Se.PreferredCodec,
                this.parseAvailableCodecs(e).filter((e) =>
                  this.config
                    .getSettingOption(Se.PreferredCodec)
                    .options.includes(e),
                ),
              );
          }
          generateStats() {
            var e;
            null === (e = this.peerConnection) ||
              void 0 === e ||
              e.getStats(null).then((e) => {
                this.aggregatedStats.processStats(e),
                  this.onVideoStats(this.aggregatedStats),
                  this.updateCodecSelection &&
                    this.config.setOptionSettingValue(
                      Se.PreferredCodec,
                      this.aggregatedStats.codecs.get(
                        this.aggregatedStats.inboundVideoStats.codecId,
                      ),
                    );
              });
          }
          close() {
            this.peerConnection &&
              (this.peerConnection.close(), (this.peerConnection = null));
          }
          mungeSDP(e, t) {
            const s = e;
            s.replace(
              /(a=fmtp:\d+ .*level-asymmetry-allowed=.*)\r\n/gm,
              '$1;x-google-start-bitrate=10000;x-google-max-bitrate=100000\r\n',
            );
            let n = '';
            return (
              (n += 'maxaveragebitrate=510000;'),
              t && (n += 'sprop-maxcapturerate=48000;'),
              (n += this.config.isFlagEnabled(ce.ForceMonoAudio)
                ? 'stereo=0;'
                : 'stereo=1;'),
              (n += 'useinbandfec=1'),
              s.replace('useinbandfec=1', n),
              s
            );
          }
          handleOnIce(e) {
            var t;
            l.Log(l.GetStackTrace(), 'peerconnection handleOnIce', 6),
              this.config.isFlagEnabled(ce.ForceTURN) &&
              e.candidate.indexOf('relay') < 0
                ? l.Info(
                    l.GetStackTrace(),
                    `Dropping candidate because it was not TURN relay. | Type= ${e.type} | Protocol= ${e.protocol} | Address=${e.address} | Port=${e.port} |`,
                    6,
                  )
                : null === (t = this.peerConnection) ||
                  void 0 === t ||
                  t.addIceCandidate(e);
          }
          handleSignalStateChange(e) {
            l.Log(l.GetStackTrace(), 'signaling state change: ' + e, 6);
          }
          handleIceConnectionStateChange(e) {
            l.Log(l.GetStackTrace(), 'ice connection state change: ' + e, 6),
              this.onIceConnectionStateChange(e);
          }
          handleIceGatheringStateChange(e) {
            l.Log(
              l.GetStackTrace(),
              'ice gathering state change: ' + JSON.stringify(e),
              6,
            );
          }
          handleOnTrack(e) {
            this.onTrack(e);
          }
          handleIceCandidate(e) {
            this.onPeerIceCandidate(e);
          }
          handleDataChannel(e) {
            this.onDataChannel(e);
          }
          onTrack(e) {}
          onIceConnectionStateChange(e) {}
          onPeerIceCandidate(e) {}
          onDataChannel(e) {}
          setupTransceiversAsync(e) {
            var t, s, n, r, i, o, a, l, d;
            return Ue(this, void 0, void 0, function* () {
              const c =
                (null === (t = this.peerConnection) || void 0 === t
                  ? void 0
                  : t.getTransceivers().length) > 0;
              if (
                (null === (s = this.peerConnection) ||
                  void 0 === s ||
                  s.addTransceiver('video', { direction: 'recvonly' }),
                RTCRtpReceiver.getCapabilities && '' != this.preferredCodec)
              )
                for (const e of null !==
                  (r =
                    null === (n = this.peerConnection) || void 0 === n
                      ? void 0
                      : n.getTransceivers()) && void 0 !== r
                  ? r
                  : [])
                  if (
                    e &&
                    e.receiver &&
                    e.receiver.track &&
                    'video' === e.receiver.track.kind
                  ) {
                    const t = this.preferredCodec.split(' '),
                      s = [
                        {
                          mimeType: 'video/' + t[0],
                          clockRate: 9e4,
                          sdpFmtpLine: t[1] ? t[1] : '',
                        },
                      ];
                    this.config
                      .getSettingOption(Se.PreferredCodec)
                      .options.filter((e) => e != this.preferredCodec)
                      .forEach((e) => {
                        const t = e.split(' ');
                        s.push({
                          mimeType: 'video/' + t[0],
                          clockRate: 9e4,
                          sdpFmtpLine: t[1] ? t[1] : '',
                        });
                      });
                    for (const e of s)
                      '' === e.sdpFmtpLine && delete e.sdpFmtpLine;
                    e.setCodecPreferences(s);
                  }
              if (e) {
                const t = {
                    video: !1,
                    audio: !!e && {
                      autoGainControl: !1,
                      channelCount: 1,
                      echoCancellation: !1,
                      latency: 0,
                      noiseSuppression: !1,
                      sampleRate: 48e3,
                      sampleSize: 16,
                      volume: 1,
                    },
                  },
                  s = yield navigator.mediaDevices.getUserMedia(t);
                if (s)
                  if (c) {
                    for (const e of null !==
                      (a =
                        null === (o = this.peerConnection) || void 0 === o
                          ? void 0
                          : o.getTransceivers()) && void 0 !== a
                      ? a
                      : [])
                      if (
                        e &&
                        e.receiver &&
                        e.receiver.track &&
                        'audio' === e.receiver.track.kind
                      )
                        for (const t of s.getTracks())
                          t.kind &&
                            'audio' == t.kind &&
                            (e.sender.replaceTrack(t),
                            (e.direction = 'sendrecv'));
                  } else
                    for (const e of s.getTracks())
                      e.kind &&
                        'audio' == e.kind &&
                        (null === (l = this.peerConnection) ||
                          void 0 === l ||
                          l.addTransceiver(e, { direction: 'sendrecv' }));
                else
                  null === (d = this.peerConnection) ||
                    void 0 === d ||
                    d.addTransceiver('audio', { direction: 'recvonly' });
              } else null === (i = this.peerConnection) || void 0 === i || i.addTransceiver('audio', { direction: 'recvonly' });
            });
          }
          onVideoStats(e) {}
          onSendWebRTCOffer(e) {}
          onSendWebRTCAnswer(e) {}
          showTextOverlayConnecting() {}
          showTextOverlaySetupFailure() {}
          parseAvailableCodecs(e) {
            if (!RTCRtpReceiver.getCapabilities)
              return ['Only available on Chrome'];
            const t = [],
              s = (0, Fe.splitSections)(e.sdp);
            return (
              s.shift(),
              s.forEach((e) => {
                const { codecs: s } = (0, Fe.parseRtpParameters)(e),
                  n = /(VP\d|H26\d|AV1).*/;
                s.forEach((e) => {
                  const s =
                    e.name +
                    ' ' +
                    Object.keys(e.parameters || {})
                      .map((t) => t + '=' + e.parameters[t])
                      .join(';');
                  if (null !== n.exec(s)) {
                    'VP9' == e.name && (e.parameters = { 'profile-id': '0' });
                    const s =
                      e.name +
                      ' ' +
                      Object.keys(e.parameters || {})
                        .map((t) => t + '=' + e.parameters[t])
                        .join(';');
                    t.push(s);
                  }
                });
              }),
              t
            );
          }
        }
        class ze {
          constructor() {
            (this.PixelStreamingSettings = new Be()),
              (this.EncoderSettings = new _e()),
              (this.WebRTCSettings = new He());
          }
          ueCompatible() {
            null != this.WebRTCSettings.MaxFPS &&
              (this.WebRTCSettings.FPS = this.WebRTCSettings.MaxFPS);
          }
        }
        class Be {}
        class _e {}
        class He {}
        class Ve {
          constructor() {
            (this.ReceiptTimeMs = null),
              (this.TransmissionTimeMs = null),
              (this.PreCaptureTimeMs = null),
              (this.PostCaptureTimeMs = null),
              (this.PreEncodeTimeMs = null),
              (this.PostEncodeTimeMs = null),
              (this.EncodeMs = null),
              (this.CaptureToSendMs = null),
              (this.testStartTimeMs = 0),
              (this.browserReceiptTimeMs = 0),
              (this.latencyExcludingDecode = 0),
              (this.testDuration = 0),
              (this.networkLatency = 0),
              (this.browserSendLatency = 0),
              (this.frameDisplayDeltaTimeMs = 0),
              (this.endToEndLatency = 0),
              (this.encodeLatency = 0);
          }
          setFrameDisplayDeltaTime(e) {
            0 == this.frameDisplayDeltaTimeMs &&
              (this.frameDisplayDeltaTimeMs = Math.round(e));
          }
          processFields() {
            null != this.EncodeMs ||
              (null == this.PreEncodeTimeMs && null == this.PostEncodeTimeMs) ||
              (l.Log(
                l.GetStackTrace(),
                `Setting Encode Ms \n ${this.PostEncodeTimeMs} \n ${this.PreEncodeTimeMs}`,
                6,
              ),
              (this.EncodeMs = this.PostEncodeTimeMs - this.PreEncodeTimeMs)),
              null != this.CaptureToSendMs ||
                (null == this.PreCaptureTimeMs &&
                  null == this.PostCaptureTimeMs) ||
                (l.Log(
                  l.GetStackTrace(),
                  `Setting CaptureToSendMs Ms \n ${this.PostCaptureTimeMs} \n ${this.PreCaptureTimeMs}`,
                  6,
                ),
                (this.CaptureToSendMs =
                  this.PostCaptureTimeMs - this.PreCaptureTimeMs));
          }
        }
        class We {
          static setExtensionFromBytes(e, t) {
            t.receiving ||
              ((t.mimetype = ''),
              (t.extension = ''),
              (t.receiving = !0),
              (t.valid = !1),
              (t.size = 0),
              (t.data = []),
              (t.timestampStart = new Date().getTime()),
              l.Log(l.GetStackTrace(), 'Received first chunk of file', 6));
            const s = new TextDecoder('utf-16').decode(e.slice(1));
            l.Log(l.GetStackTrace(), s, 6), (t.extension = s);
          }
          static setMimeTypeFromBytes(e, t) {
            t.receiving ||
              ((t.mimetype = ''),
              (t.extension = ''),
              (t.receiving = !0),
              (t.valid = !1),
              (t.size = 0),
              (t.data = []),
              (t.timestampStart = new Date().getTime()),
              l.Log(l.GetStackTrace(), 'Received first chunk of file', 6));
            const s = new TextDecoder('utf-16').decode(e.slice(1));
            l.Log(l.GetStackTrace(), s, 6), (t.mimetype = s);
          }
          static setContentsFromBytes(e, t) {
            if (!t.receiving) return;
            t.size = Math.ceil(
              new DataView(e.slice(1, 5).buffer).getInt32(0, !0) / 16379,
            );
            const s = e.slice(5);
            if (
              (t.data.push(s),
              l.Log(
                l.GetStackTrace(),
                `Received file chunk: ${t.data.length}/${t.size}`,
                6,
              ),
              t.data.length === t.size)
            ) {
              (t.receiving = !1),
                (t.valid = !0),
                l.Log(l.GetStackTrace(), 'Received complete file', 6);
              const e = new Date().getTime() - t.timestampStart,
                s = Math.round((16 * t.size * 1024) / e);
              l.Log(
                l.GetStackTrace(),
                `Average transfer bitrate: ${s}kb/s over ${e / 1e3} seconds`,
                6,
              );
              const n = new Blob(t.data, { type: t.mimetype }),
                r = document.createElement('a');
              r.setAttribute('href', URL.createObjectURL(n)),
                r.setAttribute('download', `transfer.${t.extension}`),
                document.body.append(r),
                r.remove();
            } else
              t.data.length > t.size &&
                ((t.receiving = !1),
                l.Error(
                  l.GetStackTrace(),
                  `Received bigger file than advertised: ${t.data.length}/${t.size}`,
                ));
          }
        }
        class Ne {
          constructor() {
            (this.mimetype = ''),
              (this.extension = ''),
              (this.receiving = !1),
              (this.size = 0),
              (this.data = []),
              (this.valid = !1);
          }
        }
        class Ke {}
        (Ke.mainButton = 0),
          (Ke.auxiliaryButton = 1),
          (Ke.secondaryButton = 2),
          (Ke.fourthButton = 3),
          (Ke.fifthButton = 4);
        class Qe {}
        (Qe.primaryButton = 1),
          (Qe.secondaryButton = 2),
          (Qe.auxiliaryButton = 4),
          (Qe.fourthButton = 8),
          (Qe.fifthButton = 16);
        class $e {
          constructor() {
            this.unregisterCallbacks = [];
          }
          addUnregisterCallback(e) {
            this.unregisterCallbacks.push(e);
          }
          unregisterAll() {
            for (const e of this.unregisterCallbacks) e();
            this.unregisterCallbacks = [];
          }
        }
        class qe {
          constructor(e, t, s) {
            (this.touchEventListenerTracker = new $e()),
              (this.toStreamerMessagesProvider = e),
              (this.videoElementProvider = t),
              (this.coordinateConverter = s);
            const n = (e) => this.onTouchStart(e),
              r = (e) => this.onTouchEnd(e),
              i = (e) => this.onTouchMove(e);
            document.addEventListener('touchstart', n, { passive: !1 }),
              document.addEventListener('touchend', r, { passive: !1 }),
              document.addEventListener('touchmove', i, { passive: !1 }),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('touchstart', n),
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('touchend', r),
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('touchmove', i),
              );
          }
          unregisterTouchEvents() {
            this.touchEventListenerTracker.unregisterAll();
          }
          setVideoElementParentClientRect(e) {
            this.videoElementParentClientRect = e;
          }
          onTouchStart(e) {
            if (this.videoElementProvider.isVideoReady()) {
              if (null == this.fakeTouchFinger) {
                const t = e.changedTouches[0];
                this.fakeTouchFinger = new Xe(
                  t.identifier,
                  t.clientX - this.videoElementParentClientRect.left,
                  t.clientY - this.videoElementParentClientRect.top,
                );
                const s = this.videoElementProvider.getVideoParentElement(),
                  n = new MouseEvent('mouseenter', t);
                s.dispatchEvent(n);
                const r = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                  this.fakeTouchFinger.x,
                  this.fakeTouchFinger.y,
                );
                this.toStreamerMessagesProvider.toStreamerHandlers.get(
                  'MouseDown',
                )([Ke.mainButton, r.x, r.y]);
              }
              e.preventDefault();
            }
          }
          onTouchEnd(e) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const t = this.videoElementProvider.getVideoParentElement(),
              s = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (let n = 0; n < e.changedTouches.length; n++) {
              const r = e.changedTouches[n];
              if (r.identifier === this.fakeTouchFinger.id) {
                const e = r.clientX - this.videoElementParentClientRect.left,
                  n = r.clientY - this.videoElementParentClientRect.top,
                  i = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                    e,
                    n,
                  );
                s.get('MouseUp')([Ke.mainButton, i.x, i.y]);
                const o = new MouseEvent('mouseleave', r);
                t.dispatchEvent(o), (this.fakeTouchFinger = null);
                break;
              }
            }
            e.preventDefault();
          }
          onTouchMove(e) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const t = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (let s = 0; s < e.touches.length; s++) {
              const n = e.touches[s];
              if (n.identifier === this.fakeTouchFinger.id) {
                const e = n.clientX - this.videoElementParentClientRect.left,
                  s = n.clientY - this.videoElementParentClientRect.top,
                  r = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                    e,
                    s,
                  ),
                  i = this.coordinateConverter.normalizeAndQuantizeSigned(
                    e - this.fakeTouchFinger.x,
                    s - this.fakeTouchFinger.y,
                  );
                t.get('MouseMove')([r.x, r.y, i.x, i.y]),
                  (this.fakeTouchFinger.x = e),
                  (this.fakeTouchFinger.y = s);
                break;
              }
            }
            e.preventDefault();
          }
        }
        class Xe {
          constructor(e, t, s) {
            (this.id = e), (this.x = t), (this.y = s);
          }
        }
        class je {}
        (je.backSpace = 8),
          (je.shift = 16),
          (je.control = 17),
          (je.alt = 18),
          (je.rightShift = 253),
          (je.rightControl = 254),
          (je.rightAlt = 255);
        class Je {
          constructor(e, t, s) {
            (this.keyboardEventListenerTracker = new $e()),
              (this.CodeToKeyCode = {
                Escape: 27,
                Digit0: 48,
                Digit1: 49,
                Digit2: 50,
                Digit3: 51,
                Digit4: 52,
                Digit5: 53,
                Digit6: 54,
                Digit7: 55,
                Digit8: 56,
                Digit9: 57,
                Minus: 173,
                Equal: 187,
                Backspace: 8,
                Tab: 9,
                KeyQ: 81,
                KeyW: 87,
                KeyE: 69,
                KeyR: 82,
                KeyT: 84,
                KeyY: 89,
                KeyU: 85,
                KeyI: 73,
                KeyO: 79,
                KeyP: 80,
                BracketLeft: 219,
                BracketRight: 221,
                Enter: 13,
                ControlLeft: 17,
                KeyA: 65,
                KeyS: 83,
                KeyD: 68,
                KeyF: 70,
                KeyG: 71,
                KeyH: 72,
                KeyJ: 74,
                KeyK: 75,
                KeyL: 76,
                Semicolon: 186,
                Quote: 222,
                Backquote: 192,
                ShiftLeft: 16,
                Backslash: 220,
                KeyZ: 90,
                KeyX: 88,
                KeyC: 67,
                KeyV: 86,
                KeyB: 66,
                KeyN: 78,
                KeyM: 77,
                Comma: 188,
                Period: 190,
                Slash: 191,
                ShiftRight: 253,
                AltLeft: 18,
                Space: 32,
                CapsLock: 20,
                F1: 112,
                F2: 113,
                F3: 114,
                F4: 115,
                F5: 116,
                F6: 117,
                F7: 118,
                F8: 119,
                F9: 120,
                F10: 121,
                F11: 122,
                F12: 123,
                Pause: 19,
                ScrollLock: 145,
                NumpadDivide: 111,
                NumpadMultiply: 106,
                NumpadSubtract: 109,
                NumpadAdd: 107,
                NumpadDecimal: 110,
                Numpad9: 105,
                Numpad8: 104,
                Numpad7: 103,
                Numpad6: 102,
                Numpad5: 101,
                Numpad4: 100,
                Numpad3: 99,
                Numpad2: 98,
                Numpad1: 97,
                Numpad0: 96,
                NumLock: 144,
                ControlRight: 254,
                AltRight: 255,
                Home: 36,
                End: 35,
                ArrowUp: 38,
                ArrowLeft: 37,
                ArrowRight: 39,
                ArrowDown: 40,
                PageUp: 33,
                PageDown: 34,
                Insert: 45,
                Delete: 46,
                ContextMenu: 93,
              }),
              (this.toStreamerMessagesProvider = e),
              (this.config = t),
              (this.activeKeysProvider = s);
          }
          registerKeyBoardEvents() {
            const e = (e) => this.handleOnKeyDown(e),
              t = (e) => this.handleOnKeyUp(e),
              s = (e) => this.handleOnKeyPress(e);
            document.addEventListener('keydown', e),
              document.addEventListener('keyup', t),
              document.addEventListener('keypress', s),
              this.keyboardEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('keydown', e),
              ),
              this.keyboardEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('keyup', t),
              ),
              this.keyboardEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('keypress', s),
              );
          }
          unregisterKeyBoardEvents() {
            this.keyboardEventListenerTracker.unregisterAll();
          }
          handleOnKeyDown(e) {
            const t = this.getKeycode(e);
            t &&
              (l.Log(
                l.GetStackTrace(),
                `key down ${t}, repeat = ${e.repeat}`,
                6,
              ),
              this.toStreamerMessagesProvider.toStreamerHandlers.get('KeyDown')(
                [this.getKeycode(e), e.repeat ? 1 : 0],
              ),
              this.activeKeysProvider.getActiveKeys().push(t),
              t === je.backSpace &&
                document.dispatchEvent(
                  new KeyboardEvent('keypress', { charCode: je.backSpace }),
                ),
              this.config.isFlagEnabled(ce.SuppressBrowserKeys) &&
                this.isKeyCodeBrowserKey(t) &&
                e.preventDefault());
          }
          handleOnKeyUp(e) {
            const t = this.getKeycode(e);
            t &&
              (l.Log(l.GetStackTrace(), `key up ${t}`, 6),
              this.toStreamerMessagesProvider.toStreamerHandlers.get('KeyUp')([
                t,
                e.repeat ? 1 : 0,
              ]),
              this.config.isFlagEnabled(ce.SuppressBrowserKeys) &&
                this.isKeyCodeBrowserKey(t) &&
                e.preventDefault());
          }
          handleOnKeyPress(e) {
            if (!('charCode' in e))
              return void l.Warning(
                l.GetStackTrace(),
                'KeyboardEvent.charCode is deprecated in this browser, cannot send key press.',
              );
            const t = e.charCode;
            l.Log(l.GetStackTrace(), `key press ${t}`, 6),
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                'KeyPress',
              )([t]);
          }
          getKeycode(e) {
            if (!('keyCode' in e)) {
              const t = e;
              return t.code in this.CodeToKeyCode
                ? this.CodeToKeyCode[t.code]
                : (l.Warning(
                    l.GetStackTrace(),
                    `Keyboard code of ${t.code} is not supported in our mapping, ignoring this key.`,
                  ),
                  null);
            }
            return e.keyCode === je.shift && 'ShiftRight' === e.code
              ? je.rightShift
              : e.keyCode === je.control && 'ControlRight' === e.code
              ? je.rightControl
              : e.keyCode === je.alt && 'AltRight' === e.code
              ? je.rightAlt
              : e.keyCode;
          }
          isKeyCodeBrowserKey(e) {
            return (e >= 112 && e <= 123) || 9 === e;
          }
        }
        class Ye {
          constructor(e, t, s) {
            (this.x = 0),
              (this.y = 0),
              (this.updateMouseMovePositionEvent = (e) => {
                this.updateMouseMovePosition(e);
              }),
              (this.mouseEventListenerTracker = new $e()),
              (this.videoElementProvider = e),
              (this.mouseController = t),
              (this.activeKeysProvider = s);
            const n = this.videoElementProvider.getVideoParentElement();
            (this.x = n.getBoundingClientRect().width / 2),
              (this.y = n.getBoundingClientRect().height / 2),
              (this.coord =
                this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                  this.x,
                  this.y,
                ));
          }
          unregisterMouseEvents() {
            this.mouseEventListenerTracker.unregisterAll();
          }
          lockStateChange() {
            const e = this.videoElementProvider.getVideoParentElement(),
              t =
                this.mouseController.toStreamerMessagesProvider
                  .toStreamerHandlers;
            if (
              document.pointerLockElement === e ||
              document.mozPointerLockElement === e
            )
              l.Log(l.GetStackTrace(), 'Pointer locked', 6),
                document.addEventListener(
                  'mousemove',
                  this.updateMouseMovePositionEvent,
                  !1,
                ),
                this.mouseEventListenerTracker.addUnregisterCallback(() =>
                  document.removeEventListener(
                    'mousemove',
                    this.updateMouseMovePositionEvent,
                    !1,
                  ),
                );
            else {
              l.Log(
                l.GetStackTrace(),
                'The pointer lock status is now unlocked',
                6,
              ),
                document.removeEventListener(
                  'mousemove',
                  this.updateMouseMovePositionEvent,
                  !1,
                );
              let e = this.activeKeysProvider.getActiveKeys();
              const s = new Set(e),
                n = [];
              s.forEach((e) => {
                n[e];
              }),
                n.forEach((e) => {
                  t.get('KeyUp')([e]);
                }),
                (e = []);
            }
          }
          updateMouseMovePosition(e) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const t =
                this.mouseController.toStreamerMessagesProvider
                  .toStreamerHandlers,
              s = this.videoElementProvider.getVideoParentElement().clientWidth,
              n =
                this.videoElementProvider.getVideoParentElement().clientHeight;
            (this.x += e.movementX),
              (this.y += e.movementY),
              this.x > s && (this.x -= s),
              this.y > n && (this.y -= n),
              this.x < 0 && (this.x = s + this.x),
              this.y < 0 && (this.y = n - this.y),
              (this.coord =
                this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                  this.x,
                  this.y,
                ));
            const r =
              this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(
                e.movementX,
                e.movementY,
              );
            t.get('MouseMove')([this.coord.x, this.coord.y, r.x, r.y]);
          }
          handleMouseDown(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseDown',
              )([e.button, this.coord.x, this.coord.y]);
          }
          handleMouseUp(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseUp',
              )([e.button, this.coord.x, this.coord.y]);
          }
          handleMouseWheel(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseWheel',
              )([e.wheelDelta, this.coord.x, this.coord.y]);
          }
          handleMouseDouble(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseDouble',
              )([e.button, this.coord.x, this.coord.y]);
          }
          handlePressMouseButtons(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.pressMouseButtons(e.buttons, this.x, this.y);
          }
          handleReleaseMouseButtons(e) {
            this.videoElementProvider.isVideoReady() &&
              this.mouseController.releaseMouseButtons(
                e.buttons,
                this.x,
                this.y,
              );
          }
        }
        class Ze {
          constructor(e) {
            this.mouseController = e;
          }
          unregisterMouseEvents() {}
          updateMouseMovePosition(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            l.Log(l.GetStackTrace(), 'MouseMove', 6);
            const t =
                this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                  e.offsetX,
                  e.offsetY,
                ),
              s =
                this.mouseController.coordinateConverter.normalizeAndQuantizeSigned(
                  e.movementX,
                  e.movementY,
                );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              'MouseMove',
            )([t.x, t.y, s.x, s.y]),
              e.preventDefault();
          }
          handleMouseDown(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            l.Log(l.GetStackTrace(), 'onMouse Down', 6);
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY,
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              'MouseDown',
            )([e.button, t.x, t.y]),
              e.preventDefault();
          }
          handleMouseUp(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY,
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              'MouseUp',
            )([e.button, t.x, t.y]),
              e.preventDefault();
          }
          handleContextMenu(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY,
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              'MouseUp',
            )([e.button, t.x, t.y]),
              e.preventDefault();
          }
          handleMouseWheel(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY,
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              'MouseWheel',
            )([e.wheelDelta, t.x, t.y]),
              e.preventDefault();
          }
          handleMouseDouble(e) {
            if (!this.mouseController.videoElementProvider.isVideoReady())
              return;
            const t =
              this.mouseController.coordinateConverter.normalizeAndQuantizeUnsigned(
                e.offsetX,
                e.offsetY,
              );
            this.mouseController.toStreamerMessagesProvider.toStreamerHandlers.get(
              'MouseDouble',
            )([e.button, t.x, t.y]);
          }
          handlePressMouseButtons(e) {
            this.mouseController.videoElementProvider.isVideoReady() &&
              this.mouseController.pressMouseButtons(
                e.buttons,
                e.offsetX,
                e.offsetY,
              );
          }
          handleReleaseMouseButtons(e) {
            this.mouseController.videoElementProvider.isVideoReady() &&
              this.mouseController.releaseMouseButtons(
                e.buttons,
                e.offsetX,
                e.offsetY,
              );
          }
        }
        class et {
          constructor(e, t, s, n) {
            (this.mouseEventListenerTracker = new $e()),
              (this.toStreamerMessagesProvider = e),
              (this.coordinateConverter = s),
              (this.videoElementProvider = t),
              (this.activeKeysProvider = n),
              this.registerMouseEnterAndLeaveEvents();
          }
          unregisterMouseEvents() {
            this.mouseEventListenerTracker.unregisterAll();
          }
          registerLockedMouseEvents(e) {
            const t = this.videoElementProvider.getVideoParentElement(),
              s = new Ye(this.videoElementProvider, e, this.activeKeysProvider);
            if (
              ((t.requestPointerLock =
                t.requestPointerLock || t.mozRequestPointerLock),
              (document.exitPointerLock =
                document.exitPointerLock || document.mozExitPointerLock),
              t.requestPointerLock)
            ) {
              const e = () => {
                t.requestPointerLock();
              };
              t.addEventListener('click', e),
                this.mouseEventListenerTracker.addUnregisterCallback(() =>
                  t.removeEventListener('click', e),
                );
            }
            const n = () => s.lockStateChange();
            document.addEventListener('pointerlockchange', n, !1),
              document.addEventListener('mozpointerlockchange', n, !1),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('pointerlockchange', n, !1),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('mozpointerlockchange', n, !1),
              );
            const r = (e) => s.handleMouseDown(e),
              i = (e) => s.handleMouseUp(e),
              o = (e) => s.handleMouseWheel(e),
              a = (e) => s.handleMouseDouble(e);
            t.addEventListener('mousedown', r),
              t.addEventListener('mouseup', i),
              t.addEventListener('wheel', o),
              t.addEventListener('dblclick', a),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('mousedown', r),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('mouseup', i),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('wheel', o),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('dblclick', a),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                s.unregisterMouseEvents(),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() => {
                !document.exitPointerLock ||
                  (document.pointerLockElement !== t &&
                    document.mozPointerLockElement !== t) ||
                  document.exitPointerLock();
              });
          }
          registerHoveringMouseEvents(e) {
            const t = this.videoElementProvider.getVideoParentElement(),
              s = new Ze(e),
              n = (e) => s.updateMouseMovePosition(e),
              r = (e) => s.handleMouseDown(e),
              i = (e) => s.handleMouseUp(e),
              o = (e) => s.handleContextMenu(e),
              a = (e) => s.handleMouseWheel(e),
              l = (e) => s.handleMouseDouble(e);
            t.addEventListener('mousemove', n),
              t.addEventListener('mousedown', r),
              t.addEventListener('mouseup', i),
              t.addEventListener('contextmenu', o),
              t.addEventListener('wheel', a),
              t.addEventListener('dblclick', l),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('mousemove', n),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('mousedown', r),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('mouseup', i),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('contextmenu', o),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('wheel', a),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                t.removeEventListener('dblclick', l),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                s.unregisterMouseEvents(),
              );
          }
          registerMouseEnterAndLeaveEvents() {
            const e = this.videoElementProvider.getVideoParentElement(),
              t = (e) => {
                this.videoElementProvider.isVideoReady() &&
                  (l.Log(l.GetStackTrace(), 'Mouse Entered', 6),
                  this.sendMouseEnter(),
                  this.pressMouseButtons(e.buttons, e.x, e.y));
              },
              s = (e) => {
                this.videoElementProvider.isVideoReady() &&
                  (l.Log(l.GetStackTrace(), 'Mouse Left', 6),
                  this.sendMouseLeave(),
                  this.releaseMouseButtons(e.buttons, e.x, e.y));
              };
            e.addEventListener('mouseenter', t),
              e.addEventListener('mouseleave', s),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                e.removeEventListener('mouseenter', t),
              ),
              this.mouseEventListenerTracker.addUnregisterCallback(() =>
                e.removeEventListener('mouseleave', s),
              );
          }
          releaseMouseButtons(e, t, s) {
            const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(
              t,
              s,
            );
            e & Qe.primaryButton && this.sendMouseUp(Ke.mainButton, n.x, n.y),
              e & Qe.secondaryButton &&
                this.sendMouseUp(Ke.secondaryButton, n.x, n.y),
              e & Qe.auxiliaryButton &&
                this.sendMouseUp(Ke.auxiliaryButton, n.x, n.y),
              e & Qe.fourthButton &&
                this.sendMouseUp(Ke.fourthButton, n.x, n.y),
              e & Qe.fifthButton && this.sendMouseUp(Ke.fifthButton, n.x, n.y);
          }
          pressMouseButtons(e, t, s) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(
              t,
              s,
            );
            e & Qe.primaryButton && this.sendMouseDown(Ke.mainButton, n.x, n.y),
              e & Qe.secondaryButton &&
                this.sendMouseDown(Ke.secondaryButton, n.x, n.y),
              e & Qe.auxiliaryButton &&
                this.sendMouseDown(Ke.auxiliaryButton, n.x, n.y),
              e & Qe.fourthButton &&
                this.sendMouseDown(Ke.fourthButton, n.x, n.y),
              e & Qe.fifthButton &&
                this.sendMouseDown(Ke.fifthButton, n.x, n.y);
          }
          sendMouseEnter() {
            this.videoElementProvider.isVideoReady() &&
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseEnter',
              )();
          }
          sendMouseLeave() {
            this.videoElementProvider.isVideoReady() &&
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseLeave',
              )();
          }
          sendMouseDown(e, t, s) {
            this.videoElementProvider.isVideoReady() &&
              (l.Log(
                l.GetStackTrace(),
                `mouse button ${e} down at (${t}, ${s})`,
                6,
              ),
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                'MouseDown',
              )([e, t, s]));
          }
          sendMouseUp(e, t, s) {
            if (!this.videoElementProvider.isVideoReady()) return;
            l.Log(l.GetStackTrace(), `mouse button ${e} up at (${t}, ${s})`, 6);
            const n = this.coordinateConverter.normalizeAndQuantizeUnsigned(
              t,
              s,
            );
            this.toStreamerMessagesProvider.toStreamerHandlers.get('MouseUp')([
              e,
              n.x,
              n.y,
            ]);
          }
        }
        class tt {
          constructor(e, t, s) {
            (this.fingers = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]),
              (this.fingerIds = new Map()),
              (this.maxByteValue = 255),
              (this.touchEventListenerTracker = new $e()),
              (this.toStreamerMessagesProvider = e),
              (this.videoElementProvider = t),
              (this.coordinateConverter = s),
              (this.videoElementParent = t.getVideoElement());
            const n = (e) => this.onTouchStart(e),
              r = (e) => this.onTouchEnd(e),
              i = (e) => this.onTouchMove(e);
            this.videoElementParent.addEventListener('touchstart', n, {
              passive: !1,
            }),
              this.videoElementParent.addEventListener('touchend', r, {
                passive: !1,
              }),
              this.videoElementParent.addEventListener('touchmove', i, {
                passive: !1,
              }),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                this.videoElementParent.removeEventListener('touchstart', n),
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                this.videoElementParent.removeEventListener('touchend', r),
              ),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                this.videoElementParent.removeEventListener('touchmove', i),
              ),
              l.Log(l.GetStackTrace(), 'Touch Events Registered', 6);
            const o = (e) => {
              e.preventDefault();
            };
            document.addEventListener('touchmove', o, { passive: !1 }),
              this.touchEventListenerTracker.addUnregisterCallback(() =>
                document.removeEventListener('touchmove', o),
              );
          }
          unregisterTouchEvents() {
            this.touchEventListenerTracker.unregisterAll();
          }
          rememberTouch(e) {
            const t = this.fingers.pop();
            void 0 === t &&
              l.Log(l.GetStackTrace(), 'exhausted touch identifiers', 6),
              this.fingerIds.set(e.identifier, t);
          }
          forgetTouch(e) {
            this.fingers.push(this.fingerIds.get(e.identifier)),
              this.fingers.sort(function (e, t) {
                return t - e;
              }),
              this.fingerIds.delete(e.identifier);
          }
          onTouchStart(e) {
            if (this.videoElementProvider.isVideoReady()) {
              for (let t = 0; t < e.changedTouches.length; t++)
                this.rememberTouch(e.changedTouches[t]);
              l.Log(l.GetStackTrace(), 'touch start', 6),
                this.emitTouchData('TouchStart', e.changedTouches),
                e.preventDefault();
            }
          }
          onTouchEnd(e) {
            if (this.videoElementProvider.isVideoReady()) {
              l.Log(l.GetStackTrace(), 'touch end', 6),
                this.emitTouchData('TouchEnd', e.changedTouches);
              for (let t = 0; t < e.changedTouches.length; t++)
                this.forgetTouch(e.changedTouches[t]);
              e.preventDefault();
            }
          }
          onTouchMove(e) {
            this.videoElementProvider.isVideoReady() &&
              (l.Log(l.GetStackTrace(), 'touch move', 6),
              this.emitTouchData('TouchMove', e.touches),
              e.preventDefault());
          }
          emitTouchData(e, t) {
            if (!this.videoElementProvider.isVideoReady()) return;
            const s = this.videoElementProvider.getVideoParentElement(),
              n = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (let r = 0; r < t.length; r++) {
              const i = 1,
                o = t[r],
                a = o.clientX - s.offsetLeft,
                d = o.clientY - s.offsetTop;
              l.Log(
                l.GetStackTrace(),
                `F${this.fingerIds.get(o.identifier)}=(${a}, ${d})`,
                6,
              );
              const c = this.coordinateConverter.normalizeAndQuantizeUnsigned(
                a,
                d,
              );
              switch (e) {
                case 'TouchStart':
                  n.get('TouchStart')([
                    i,
                    c.x,
                    c.y,
                    this.fingerIds.get(o.identifier),
                    this.maxByteValue * o.force,
                    c.inRange ? 1 : 0,
                  ]);
                  break;
                case 'TouchEnd':
                  n.get('TouchEnd')([
                    i,
                    c.x,
                    c.y,
                    this.fingerIds.get(o.identifier),
                    this.maxByteValue * o.force,
                    c.inRange ? 1 : 0,
                  ]);
                  break;
                case 'TouchMove':
                  n.get('TouchMove')([
                    i,
                    c.x,
                    c.y,
                    this.fingerIds.get(o.identifier),
                    this.maxByteValue * o.force,
                    c.inRange ? 1 : 0,
                  ]);
              }
            }
          }
        }
        class st {
          constructor(e) {
            (this.gamePadEventListenerTracker = new $e()),
              (this.toStreamerMessagesProvider = e),
              (this.requestAnimationFrame = (
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.requestAnimationFrame
              ).bind(window));
            const t = window;
            if ('GamepadEvent' in t) {
              const e = (e) => this.gamePadConnectHandler(e),
                t = (e) => this.gamePadDisconnectHandler(e);
              window.addEventListener('gamepadconnected', e),
                window.addEventListener('gamepaddisconnected', t),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener('gamepadconnected', e),
                ),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener('gamepaddisconnected', t),
                );
            } else if ('WebKitGamepadEvent' in t) {
              const e = (e) => this.gamePadConnectHandler(e),
                t = (e) => this.gamePadDisconnectHandler(e);
              window.addEventListener('webkitgamepadconnected', e),
                window.addEventListener('webkitgamepaddisconnected', t),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener('webkitgamepadconnected', e),
                ),
                this.gamePadEventListenerTracker.addUnregisterCallback(() =>
                  window.removeEventListener('webkitgamepaddisconnected', t),
                );
            }
            if (((this.controllers = []), navigator.getGamepads))
              for (const e of navigator.getGamepads())
                e &&
                  this.gamePadConnectHandler(
                    new GamepadEvent('gamepadconnected', { gamepad: e }),
                  );
          }
          unregisterGamePadEvents() {
            this.gamePadEventListenerTracker.unregisterAll();
            for (const e of this.controllers)
              void 0 !== e.id && this.onGamepadDisconnected(e.id);
            (this.controllers = []),
              (this.onGamepadConnected = () => {}),
              (this.onGamepadDisconnected = () => {});
          }
          gamePadConnectHandler(e) {
            l.Log(l.GetStackTrace(), 'Gamepad connect handler', 6);
            const t = e.gamepad,
              s = { currentState: t, prevState: t, id: void 0 };
            this.controllers.push(s),
              (this.controllers[t.index].currentState = t),
              (this.controllers[t.index].prevState = t),
              l.Log(l.GetStackTrace(), 'gamepad: ' + t.id + ' connected', 6),
              window.requestAnimationFrame(() => this.updateStatus()),
              this.onGamepadConnected();
          }
          gamePadDisconnectHandler(e) {
            l.Log(l.GetStackTrace(), 'Gamepad disconnect handler', 6),
              l.Log(
                l.GetStackTrace(),
                'gamepad: ' + e.gamepad.id + ' disconnected',
                6,
              );
            const t = this.controllers[e.gamepad.index];
            delete this.controllers[e.gamepad.index],
              (this.controllers = this.controllers.filter((e) => void 0 !== e)),
              this.onGamepadDisconnected(t.id);
          }
          scanGamePads() {
            const e = navigator.getGamepads
              ? navigator.getGamepads()
              : navigator.webkitGetGamepads
              ? navigator.webkitGetGamepads()
              : [];
            for (let t = 0; t < e.length; t++)
              e[t] &&
                e[t].index in this.controllers &&
                (this.controllers[e[t].index].currentState = e[t]);
          }
          updateStatus() {
            this.scanGamePads();
            const e = this.toStreamerMessagesProvider.toStreamerHandlers;
            for (const t of this.controllers) {
              const s = void 0 === t.id ? this.controllers.indexOf(t) : t.id,
                n = t.currentState;
              for (let n = 0; n < t.currentState.buttons.length; n++) {
                const r = t.currentState.buttons[n],
                  i = t.prevState.buttons[n];
                r.pressed
                  ? n == Oe.LeftTrigger
                    ? e.get('GamepadAnalog')([s, 5, r.value])
                    : n == Oe.RightTrigger
                    ? e.get('GamepadAnalog')([s, 6, r.value])
                    : e.get('GamepadButtonPressed')([s, n, i.pressed ? 1 : 0])
                  : !r.pressed &&
                    i.pressed &&
                    (n == Oe.LeftTrigger
                      ? e.get('GamepadAnalog')([s, 5, 0])
                      : n == Oe.RightTrigger
                      ? e.get('GamepadAnalog')([s, 6, 0])
                      : e.get('GamepadButtonReleased')([s, n]));
              }
              for (let t = 0; t < n.axes.length; t += 2) {
                const r = parseFloat(n.axes[t].toFixed(4)),
                  i = -parseFloat(n.axes[t + 1].toFixed(4));
                e.get('GamepadAnalog')([s, t + 1, r]),
                  e.get('GamepadAnalog')([s, t + 2, i]);
              }
              this.controllers[s].prevState = n;
            }
            this.controllers.length > 0 &&
              this.requestAnimationFrame(() => this.updateStatus());
          }
          onGamepadResponseReceived(e) {
            for (const t of this.controllers)
              if (void 0 === t.id) {
                t.id = e;
                break;
              }
          }
          onGamepadConnected() {}
          onGamepadDisconnected(e) {}
        }
        !(function (e) {
          (e[(e.RightClusterBottomButton = 0)] = 'RightClusterBottomButton'),
            (e[(e.RightClusterRightButton = 1)] = 'RightClusterRightButton'),
            (e[(e.RightClusterLeftButton = 2)] = 'RightClusterLeftButton'),
            (e[(e.RightClusterTopButton = 3)] = 'RightClusterTopButton'),
            (e[(e.LeftShoulder = 4)] = 'LeftShoulder'),
            (e[(e.RightShoulder = 5)] = 'RightShoulder'),
            (e[(e.LeftTrigger = 6)] = 'LeftTrigger'),
            (e[(e.RightTrigger = 7)] = 'RightTrigger'),
            (e[(e.SelectOrBack = 8)] = 'SelectOrBack'),
            (e[(e.StartOrForward = 9)] = 'StartOrForward'),
            (e[(e.LeftAnalogPress = 10)] = 'LeftAnalogPress'),
            (e[(e.RightAnalogPress = 11)] = 'RightAnalogPress'),
            (e[(e.LeftClusterTopButton = 12)] = 'LeftClusterTopButton'),
            (e[(e.LeftClusterBottomButton = 13)] = 'LeftClusterBottomButton'),
            (e[(e.LeftClusterLeftButton = 14)] = 'LeftClusterLeftButton'),
            (e[(e.LeftClusterRightButton = 15)] = 'LeftClusterRightButton'),
            (e[(e.CentreButton = 16)] = 'CentreButton'),
            (e[(e.LeftStickHorizontal = 0)] = 'LeftStickHorizontal'),
            (e[(e.LeftStickVertical = 1)] = 'LeftStickVertical'),
            (e[(e.RightStickHorizontal = 2)] = 'RightStickHorizontal'),
            (e[(e.RightStickVertical = 3)] = 'RightStickVertical');
        })(Oe || (Oe = {}));
        class nt {
          constructor(e, t, s) {
            (this.activeKeys = new rt()),
              (this.toStreamerMessagesProvider = e),
              (this.videoElementProvider = t),
              (this.coordinateConverter = s);
          }
          registerKeyBoard(e) {
            l.Log(l.GetStackTrace(), 'Register Keyboard Events', 7);
            const t = new Je(
              this.toStreamerMessagesProvider,
              e,
              this.activeKeys,
            );
            return t.registerKeyBoardEvents(), t;
          }
          registerMouse(e) {
            l.Log(l.GetStackTrace(), 'Register Mouse Events', 7);
            const t = new et(
              this.toStreamerMessagesProvider,
              this.videoElementProvider,
              this.coordinateConverter,
              this.activeKeys,
            );
            switch (e) {
              case Ce.LockedMouse:
                t.registerLockedMouseEvents(t);
                break;
              case Ce.HoveringMouse:
                t.registerHoveringMouseEvents(t);
                break;
              default:
                l.Info(
                  l.GetStackTrace(),
                  'unknown Control Scheme Type Defaulting to Locked Mouse Events',
                ),
                  t.registerLockedMouseEvents(t);
            }
            return t;
          }
          registerTouch(e, t) {
            if ((l.Log(l.GetStackTrace(), 'Registering Touch', 6), e)) {
              const e = new qe(
                this.toStreamerMessagesProvider,
                this.videoElementProvider,
                this.coordinateConverter,
              );
              return e.setVideoElementParentClientRect(t), e;
            }
            return new tt(
              this.toStreamerMessagesProvider,
              this.videoElementProvider,
              this.coordinateConverter,
            );
          }
          registerGamePad() {
            return (
              l.Log(l.GetStackTrace(), 'Register Game Pad', 7),
              new st(this.toStreamerMessagesProvider)
            );
          }
        }
        class rt {
          constructor() {
            (this.activeKeys = []), (this.activeKeys = []);
          }
          getActiveKeys() {
            return this.activeKeys;
          }
        }
        class it {
          constructor(e, t) {
            (this.lastTimeResized = new Date().getTime()),
              (this.videoElement = document.createElement('video')),
              (this.config = t),
              (this.videoElement.id = 'streamingVideo'),
              (this.videoElement.disablePictureInPicture = !0),
              (this.videoElement.playsInline = !0),
              (this.videoElement.style.width = '100%'),
              (this.videoElement.style.height = '100%'),
              (this.videoElement.style.position = 'absolute'),
              (this.videoElement.style.pointerEvents = 'all'),
              e.appendChild(this.videoElement),
              (this.onResizePlayerCallback = () => {
                console.log(
                  'Resolution changed, restyling player, did you forget to override this function?',
                );
              }),
              (this.onMatchViewportResolutionCallback = () => {
                console.log(
                  'Resolution changed and match viewport resolution is turned on, did you forget to override this function?',
                );
              }),
              (this.videoElement.onclick = () => {
                this.videoElement.paused && this.videoElement.play();
              }),
              (this.videoElement.onloadedmetadata = () => {
                this.onVideoInitialized();
              }),
              window.addEventListener(
                'resize',
                () => this.resizePlayerStyle(),
                !0,
              ),
              window.addEventListener('orientationchange', () =>
                this.onOrientationChange(),
              );
          }
          play() {
            return (
              (this.videoElement.muted = this.config.isFlagEnabled(
                ce.StartVideoMuted,
              )),
              (this.videoElement.autoplay = this.config.isFlagEnabled(
                ce.AutoPlayVideo,
              )),
              this.videoElement.play()
            );
          }
          isPaused() {
            return this.videoElement.paused;
          }
          isVideoReady() {
            return (
              void 0 !== this.videoElement.readyState &&
              this.videoElement.readyState > 0
            );
          }
          hasVideoSource() {
            return (
              void 0 !== this.videoElement.srcObject &&
              null !== this.videoElement.srcObject
            );
          }
          getVideoElement() {
            return this.videoElement;
          }
          getVideoParentElement() {
            return this.videoElement.parentElement;
          }
          setVideoEnabled(e) {
            this.videoElement.srcObject
              .getTracks()
              .forEach((t) => (t.enabled = e));
          }
          onVideoInitialized() {}
          onOrientationChange() {
            clearTimeout(this.orientationChangeTimeout),
              (this.orientationChangeTimeout = window.setTimeout(() => {
                this.resizePlayerStyle();
              }, 500));
          }
          resizePlayerStyle() {
            const e = this.getVideoParentElement();
            e &&
              (this.updateVideoStreamSize(),
              e.classList.contains('fixed-size') ||
                this.resizePlayerStyleToFillParentElement(),
              this.onResizePlayerCallback());
          }
          resizePlayerStyleToFillParentElement() {
            this.getVideoParentElement().setAttribute(
              'style',
              'top: 0px; left: 0px; width: 100%; height: 100%; cursor: default;',
            );
          }
          updateVideoStreamSize() {
            if (this.config.isFlagEnabled(ce.MatchViewportResolution))
              if (new Date().getTime() - this.lastTimeResized > 300) {
                const e = this.getVideoParentElement();
                if (!e) return;
                this.onMatchViewportResolutionCallback(
                  e.clientWidth,
                  e.clientHeight,
                ),
                  (this.lastTimeResized = new Date().getTime());
              } else
                l.Log(l.GetStackTrace(), 'Resizing too often - skipping', 6),
                  clearTimeout(this.resizeTimeoutHandle),
                  (this.resizeTimeoutHandle = window.setTimeout(
                    () => this.updateVideoStreamSize(),
                    100,
                  ));
          }
        }
        class ot {
          constructor() {
            (this.map = new Map()), (this.reverseMap = new Map());
          }
          getFromKey(e) {
            return this.map.get(e);
          }
          getFromValue(e) {
            return this.reverseMap.get(e);
          }
          add(e, t) {
            this.map.set(e, t), this.reverseMap.set(t, e);
          }
          remove(e, t) {
            this.map.delete(e), this.reverseMap.delete(t);
          }
        }
        class at {
          constructor() {
            (this.toStreamerHandlers = new Map()),
              (this.fromStreamerHandlers = new Map()),
              (this.toStreamerMessages = new ot()),
              (this.fromStreamerMessages = new ot());
          }
          populateDefaultProtocol() {
            this.toStreamerMessages.add('IFrameRequest', {
              id: 0,
              byteLength: 0,
              structure: [],
            }),
              this.toStreamerMessages.add('RequestQualityControl', {
                id: 1,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('FpsRequest', {
                id: 2,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('AverageBitrateRequest', {
                id: 3,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('StartStreaming', {
                id: 4,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('StopStreaming', {
                id: 5,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('LatencyTest', {
                id: 6,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('RequestInitialSettings', {
                id: 7,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('TestEcho', {
                id: 8,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('UIInteraction', {
                id: 50,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('Command', {
                id: 51,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('KeyDown', {
                id: 60,
                byteLength: 2,
                structure: ['uint8', 'uint8'],
              }),
              this.toStreamerMessages.add('KeyUp', {
                id: 61,
                byteLength: 1,
                structure: ['uint8'],
              }),
              this.toStreamerMessages.add('KeyPress', {
                id: 62,
                byteLength: 2,
                structure: ['uint16'],
              }),
              this.toStreamerMessages.add('MouseEnter', {
                id: 70,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('MouseLeave', {
                id: 71,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('MouseDown', {
                id: 72,
                byteLength: 5,
                structure: ['uint8', 'uint16', 'uint16'],
              }),
              this.toStreamerMessages.add('MouseUp', {
                id: 73,
                byteLength: 5,
                structure: ['uint8', 'uint16', 'uint16'],
              }),
              this.toStreamerMessages.add('MouseMove', {
                id: 74,
                byteLength: 8,
                structure: ['uint16', 'uint16', 'int16', 'int16'],
              }),
              this.toStreamerMessages.add('MouseWheel', {
                id: 75,
                byteLength: 6,
                structure: ['int16', 'uint16', 'uint16'],
              }),
              this.toStreamerMessages.add('MouseDouble', {
                id: 76,
                byteLength: 5,
                structure: ['uint8', 'uint16', 'uint16'],
              }),
              this.toStreamerMessages.add('TouchStart', {
                id: 80,
                byteLength: 8,
                structure: [
                  'uint8',
                  'uint16',
                  'uint16',
                  'uint8',
                  'uint8',
                  'uint8',
                ],
              }),
              this.toStreamerMessages.add('TouchEnd', {
                id: 81,
                byteLength: 8,
                structure: [
                  'uint8',
                  'uint16',
                  'uint16',
                  'uint8',
                  'uint8',
                  'uint8',
                ],
              }),
              this.toStreamerMessages.add('TouchMove', {
                id: 82,
                byteLength: 8,
                structure: [
                  'uint8',
                  'uint16',
                  'uint16',
                  'uint8',
                  'uint8',
                  'uint8',
                ],
              }),
              this.toStreamerMessages.add('GamepadConnected', {
                id: 93,
                byteLength: 0,
                structure: [],
              }),
              this.toStreamerMessages.add('GamepadButtonPressed', {
                id: 90,
                byteLength: 3,
                structure: ['uint8', 'uint8', 'uint8'],
              }),
              this.toStreamerMessages.add('GamepadButtonReleased', {
                id: 91,
                byteLength: 3,
                structure: ['uint8', 'uint8', 'uint8'],
              }),
              this.toStreamerMessages.add('GamepadAnalog', {
                id: 92,
                byteLength: 10,
                structure: ['uint8', 'uint8', 'double'],
              }),
              this.toStreamerMessages.add('GamepadDisconnected', {
                id: 94,
                byteLength: 1,
                structure: ['uint8'],
              }),
              this.fromStreamerMessages.add('QualityControlOwnership', 0),
              this.fromStreamerMessages.add('Response', 1),
              this.fromStreamerMessages.add('Command', 2),
              this.fromStreamerMessages.add('FreezeFrame', 3),
              this.fromStreamerMessages.add('UnfreezeFrame', 4),
              this.fromStreamerMessages.add('VideoEncoderAvgQP', 5),
              this.fromStreamerMessages.add('LatencyTest', 6),
              this.fromStreamerMessages.add('InitialSettings', 7),
              this.fromStreamerMessages.add('FileExtension', 8),
              this.fromStreamerMessages.add('FileMimeType', 9),
              this.fromStreamerMessages.add('FileContents', 10),
              this.fromStreamerMessages.add('TestEcho', 11),
              this.fromStreamerMessages.add('InputControlOwnership', 12),
              this.fromStreamerMessages.add('GamepadResponse', 13),
              this.fromStreamerMessages.add('Protocol', 255);
          }
          registerMessageHandler(e, t, s) {
            switch (e) {
              case Ie.ToStreamer:
                this.toStreamerHandlers.set(t, s);
                break;
              case Ie.FromStreamer:
                this.fromStreamerHandlers.set(t, s);
                break;
              default:
                l.Log(l.GetStackTrace(), `Unknown message direction ${e}`);
            }
          }
        }
        !(function (e) {
          (e[(e.ToStreamer = 0)] = 'ToStreamer'),
            (e[(e.FromStreamer = 1)] = 'FromStreamer');
        })(Ie || (Ie = {}));
        class lt {
          constructor() {
            this.responseEventListeners = new Map();
          }
          addResponseEventListener(e, t) {
            this.responseEventListeners.set(e, t);
          }
          removeResponseEventListener(e) {
            this.responseEventListeners.delete(e);
          }
          onResponse(e) {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.Response',
              6,
            );
            const t = new TextDecoder('utf-16').decode(e.slice(1));
            l.Log(l.GetStackTrace(), t, 6),
              this.responseEventListeners.forEach((e) => {
                e(t);
              });
          }
        }
        class dt {
          constructor(e, t) {
            (this.dataChannelSender = e),
              (this.toStreamerMessagesMapProvider = t);
          }
          sendLatencyTest(e) {
            this.sendDescriptor('LatencyTest', e);
          }
          emitCommand(e) {
            this.sendDescriptor('Command', e);
          }
          emitUIInteraction(e) {
            this.sendDescriptor('UIInteraction', e);
          }
          sendDescriptor(e, t) {
            const s = JSON.stringify(t),
              n =
                this.toStreamerMessagesMapProvider.toStreamerMessages.getFromKey(
                  e,
                );
            void 0 === n &&
              l.Error(
                l.GetStackTrace(),
                `Attempted to emit descriptor with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`,
              ),
              l.Log(l.GetStackTrace(), 'Sending: ' + t, 6);
            const r = new DataView(new ArrayBuffer(3 + 2 * s.length));
            let i = 0;
            r.setUint8(i, n.id), i++, r.setUint16(i, s.length, !0), (i += 2);
            for (let e = 0; e < s.length; e++)
              r.setUint16(i, s.charCodeAt(e), !0), (i += 2);
            this.dataChannelSender.canSend()
              ? this.dataChannelSender.sendData(r.buffer)
              : l.Info(
                  l.GetStackTrace(),
                  `Data channel cannot send yet, skipping sending descriptor message: ${e} - ${s}`,
                );
          }
        }
        class ct {
          constructor(e, t) {
            (this.dataChannelSender = e),
              (this.toStreamerMessagesMapProvider = t);
          }
          sendMessageToStreamer(e, t) {
            void 0 === t && (t = []);
            const s =
              this.toStreamerMessagesMapProvider.toStreamerMessages.getFromKey(
                e,
              );
            if (void 0 === s)
              return void l.Error(
                l.GetStackTrace(),
                `Attempted to send a message to the streamer with message type: ${e}, but the frontend hasn't been configured to send such a message. Check you've added the message type in your cpp`,
              );
            const n = new DataView(new ArrayBuffer(s.byteLength + 1));
            n.setUint8(0, s.id);
            let r = 1;
            t.forEach((e, t) => {
              switch (s.structure[t]) {
                case 'uint8':
                  n.setUint8(r, e), (r += 1);
                  break;
                case 'uint16':
                  n.setUint16(r, e, !0), (r += 2);
                  break;
                case 'int16':
                  n.setInt16(r, e, !0), (r += 2);
                  break;
                case 'float':
                  n.setFloat32(r, e, !0), (r += 4);
                  break;
                case 'double':
                  n.setFloat64(r, e, !0), (r += 8);
              }
            }),
              this.dataChannelSender.canSend()
                ? this.dataChannelSender.sendData(n.buffer)
                : l.Info(
                    l.GetStackTrace(),
                    `Data channel cannot send yet, skipping sending message: ${e} - ${new Uint8Array(
                      n.buffer,
                    )}`,
                  );
          }
        }
        class ht {
          constructor(e) {
            this.sendMessageController = e;
          }
          SendRequestQualityControl() {
            this.sendMessageController.sendMessageToStreamer(
              'RequestQualityControl',
            );
          }
          SendMaxFpsRequest() {
            this.sendMessageController.sendMessageToStreamer('FpsRequest');
          }
          SendAverageBitrateRequest() {
            this.sendMessageController.sendMessageToStreamer(
              'AverageBitrateRequest',
            );
          }
          SendStartStreaming() {
            this.sendMessageController.sendMessageToStreamer('StartStreaming');
          }
          SendStopStreaming() {
            this.sendMessageController.sendMessageToStreamer('StopStreaming');
          }
          SendRequestInitialSettings() {
            this.sendMessageController.sendMessageToStreamer(
              'RequestInitialSettings',
            );
          }
        }
        class ut {
          constructor(e) {
            this.dataChannelProvider = e;
          }
          canSend() {
            return (
              void 0 !==
                this.dataChannelProvider.getDataChannelInstance().dataChannel &&
              'open' ==
                this.dataChannelProvider.getDataChannelInstance().dataChannel
                  .readyState
            );
          }
          sendData(e) {
            const t = this.dataChannelProvider.getDataChannelInstance();
            'open' == t.dataChannel.readyState
              ? (t.dataChannel.send(e),
                l.Log(
                  l.GetStackTrace(),
                  `Message Sent: ${new Uint8Array(e)}`,
                  6,
                ),
                this.resetAfkWarningTimerOnDataSend())
              : l.Error(
                  l.GetStackTrace(),
                  `Message Failed: ${new Uint8Array(e)}`,
                );
          }
          resetAfkWarningTimerOnDataSend() {}
        }
        class gt {
          constructor(e) {
            (this.videoElementProvider = e),
              (this.normalizeAndQuantizeUnsignedFunc = () => {
                throw new Error(
                  'Normalize and quantize unsigned, method not implemented.',
                );
              }),
              (this.normalizeAndQuantizeSignedFunc = () => {
                throw new Error(
                  'Normalize and unquantize signed, method not implemented.',
                );
              }),
              (this.denormalizeAndUnquantizeUnsignedFunc = () => {
                throw new Error(
                  'Denormalize and unquantize unsigned, method not implemented.',
                );
              });
          }
          normalizeAndQuantizeUnsigned(e, t) {
            return this.normalizeAndQuantizeUnsignedFunc(e, t);
          }
          unquantizeAndDenormalizeUnsigned(e, t) {
            return this.denormalizeAndUnquantizeUnsignedFunc(e, t);
          }
          normalizeAndQuantizeSigned(e, t) {
            return this.normalizeAndQuantizeSignedFunc(e, t);
          }
          setupNormalizeAndQuantize() {
            if (
              ((this.videoElementParent =
                this.videoElementProvider.getVideoParentElement()),
              (this.videoElement = this.videoElementProvider.getVideoElement()),
              this.videoElementParent && this.videoElement)
            ) {
              const e =
                  this.videoElementParent.clientHeight /
                  this.videoElementParent.clientWidth,
                t =
                  this.videoElement.videoHeight / this.videoElement.videoWidth;
              e > t
                ? (l.Log(
                    l.GetStackTrace(),
                    'Setup Normalize and Quantize for playerAspectRatio > videoAspectRatio',
                    6,
                  ),
                  (this.ratio = e / t),
                  (this.normalizeAndQuantizeUnsignedFunc = (e, t) =>
                    this.normalizeAndQuantizeUnsignedPlayerBigger(e, t)),
                  (this.normalizeAndQuantizeSignedFunc = (e, t) =>
                    this.normalizeAndQuantizeSignedPlayerBigger(e, t)),
                  (this.denormalizeAndUnquantizeUnsignedFunc = (e, t) =>
                    this.denormalizeAndUnquantizeUnsignedPlayerBigger(e, t)))
                : (l.Log(
                    l.GetStackTrace(),
                    'Setup Normalize and Quantize for playerAspectRatio <= videoAspectRatio',
                    6,
                  ),
                  (this.ratio = t / e),
                  (this.normalizeAndQuantizeUnsignedFunc = (e, t) =>
                    this.normalizeAndQuantizeUnsignedPlayerSmaller(e, t)),
                  (this.normalizeAndQuantizeSignedFunc = (e, t) =>
                    this.normalizeAndQuantizeSignedPlayerSmaller(e, t)),
                  (this.denormalizeAndUnquantizeUnsignedFunc = (e, t) =>
                    this.denormalizeAndUnquantizeUnsignedPlayerSmaller(e, t)));
            }
          }
          normalizeAndQuantizeUnsignedPlayerBigger(e, t) {
            const s = e / this.videoElementParent.clientWidth,
              n =
                this.ratio * (t / this.videoElementParent.clientHeight - 0.5) +
                0.5;
            return s < 0 || s > 1 || n < 0 || n > 1
              ? new mt(!1, 65535, 65535)
              : new mt(!0, 65536 * s, 65536 * n);
          }
          denormalizeAndUnquantizeUnsignedPlayerBigger(e, t) {
            const s = e / 65536,
              n = (t / 65536 - 0.5) / this.ratio + 0.5;
            return new pt(
              s * this.videoElementParent.clientWidth,
              n * this.videoElementParent.clientHeight,
            );
          }
          normalizeAndQuantizeSignedPlayerBigger(e, t) {
            const s = e / (0.5 * this.videoElementParent.clientWidth),
              n =
                (this.ratio * t) / (0.5 * this.videoElementParent.clientHeight);
            return new St(32767 * s, 32767 * n);
          }
          normalizeAndQuantizeUnsignedPlayerSmaller(e, t) {
            const s =
                this.ratio * (e / this.videoElementParent.clientWidth - 0.5) +
                0.5,
              n = t / this.videoElementParent.clientHeight;
            return s < 0 || s > 1 || n < 0 || n > 1
              ? new mt(!1, 65535, 65535)
              : new mt(!0, 65536 * s, 65536 * n);
          }
          denormalizeAndUnquantizeUnsignedPlayerSmaller(e, t) {
            const s = (e / 65536 - 0.5) / this.ratio + 0.5,
              n = t / 65536;
            return new pt(
              s * this.videoElementParent.clientWidth,
              n * this.videoElementParent.clientHeight,
            );
          }
          normalizeAndQuantizeSignedPlayerSmaller(e, t) {
            const s =
                (this.ratio * e) / (0.5 * this.videoElementParent.clientWidth),
              n = t / (0.5 * this.videoElementParent.clientHeight);
            return new St(32767 * s, 32767 * n);
          }
        }
        class mt {
          constructor(e, t, s) {
            (this.inRange = e), (this.x = t), (this.y = s);
          }
        }
        class pt {
          constructor(e, t) {
            (this.x = e), (this.y = t);
          }
        }
        class St {
          constructor(e, t) {
            (this.x = e), (this.y = t);
          }
        }
        class vt {
          constructor(e, t) {
            (this.shouldShowPlayOverlay = !0),
              (this.config = e),
              (this.pixelStreaming = t),
              (this.responseController = new lt()),
              (this.file = new Ne()),
              (this.sdpConstraints = {
                offerToReceiveAudio: !0,
                offerToReceiveVideo: !0,
              }),
              (this.afkController = new ye(
                this.config,
                this.pixelStreaming,
                this.onAfkTriggered.bind(this),
              )),
              (this.afkController.onAFKTimedOutCallback = () => {
                this.setDisconnectMessageOverride(
                  'You have been disconnected due to inactivity',
                ),
                  this.closeSignalingServer();
              }),
              (this.freezeFrameController = new w(
                this.pixelStreaming.videoElementParent,
              )),
              (this.videoPlayer = new it(
                this.pixelStreaming.videoElementParent,
                this.config,
              )),
              (this.videoPlayer.onVideoInitialized = () =>
                this.handleVideoInitialized()),
              (this.videoPlayer.onMatchViewportResolutionCallback = (e, t) => {
                const s = { 'Resolution.Width': e, 'Resolution.Height': t };
                this.sendDescriptorController.emitCommand(s);
              }),
              (this.videoPlayer.onResizePlayerCallback = () => {
                this.setUpMouseAndFreezeFrame();
              }),
              (this.streamController = new b(this.videoPlayer)),
              (this.coordinateConverter = new gt(this.videoPlayer)),
              (this.sendrecvDataChannelController = new Te()),
              (this.recvDataChannelController = new Te()),
              this.registerDataChannelEventEmitters(
                this.sendrecvDataChannelController,
              ),
              this.registerDataChannelEventEmitters(
                this.recvDataChannelController,
              ),
              (this.dataChannelSender = new ut(
                this.sendrecvDataChannelController,
              )),
              (this.dataChannelSender.resetAfkWarningTimerOnDataSend = () =>
                this.afkController.resetAfkWarningTimer()),
              (this.streamMessageController = new at()),
              (this.webSocketController = new E()),
              (this.webSocketController.onConfig = (e) =>
                this.handleOnConfigMessage(e)),
              (this.webSocketController.onStreamerList = (e) =>
                this.handleStreamerListMessage(e)),
              (this.webSocketController.onWebSocketOncloseOverlayMessage = (
                e,
              ) => {
                this.pixelStreaming._onDisconnect(
                  `Websocket disconnect (${e.code}) ${
                    '' != e.reason ? '- ' + e.reason : ''
                  }`,
                ),
                  this.setVideoEncoderAvgQP(0);
              }),
              this.webSocketController.onOpen.addEventListener('open', () => {
                this.config.isFlagEnabled(ce.BrowserSendOffer) ||
                  this.webSocketController.requestStreamerList();
              }),
              this.webSocketController.onClose.addEventListener('close', () => {
                this.afkController.stopAfkWarningTimer(),
                  this.statsTimerHandle &&
                    void 0 !== this.statsTimerHandle &&
                    window.clearInterval(this.statsTimerHandle),
                  this.setTouchInputEnabled(!1),
                  this.setMouseInputEnabled(!1),
                  this.setKeyboardInputEnabled(!1),
                  this.setGamePadInputEnabled(!1),
                  this.shouldReconnect &&
                    this.config.getNumericSettingValue(
                      ue.MaxReconnectAttempts,
                    ) > 0 &&
                    ((this.isReconnecting = !0),
                    this.reconnectAttempt++,
                    this.restartStreamAutomatically());
              }),
              (this.sendDescriptorController = new dt(
                this.dataChannelSender,
                this.streamMessageController,
              )),
              (this.sendMessageController = new ct(
                this.dataChannelSender,
                this.streamMessageController,
              )),
              (this.toStreamerMessagesController = new ht(
                this.sendMessageController,
              )),
              this.registerMessageHandlers(),
              this.streamMessageController.populateDefaultProtocol(),
              (this.inputClassesFactory = new nt(
                this.streamMessageController,
                this.videoPlayer,
                this.coordinateConverter,
              )),
              (this.isUsingSFU = !1),
              (this.isQualityController = !1),
              (this.preferredCodec = ''),
              (this.shouldReconnect = !0),
              (this.isReconnecting = !1),
              (this.reconnectAttempt = 0),
              this.config._addOnOptionSettingChangedListener(
                Se.StreamerId,
                (e) => {
                  '' !== e &&
                    (this.peerConnectionController.peerConnection.close(),
                    this.peerConnectionController.createPeerConnection(
                      this.peerConfig,
                      this.preferredCodec,
                    ),
                    (this.subscribedStream = e),
                    this.webSocketController.sendSubscribe(e));
                },
              ),
              this.setVideoEncoderAvgQP(-1),
              (this.signallingUrlBuilder = () => {
                let e = this.config.getTextSettingValue(me.SignallingServerUrl);
                return (
                  this.config.isFlagEnabled(ce.BrowserSendOffer) &&
                    (e += '?' + ce.BrowserSendOffer + '=true'),
                  e
                );
              });
          }
          requestUnquantizedAndDenormalizeUnsigned(e, t) {
            return this.coordinateConverter.unquantizeAndDenormalizeUnsigned(
              e,
              t,
            );
          }
          handleOnMessage(e) {
            const t = new Uint8Array(e.data);
            l.Log(l.GetStackTrace(), 'Message incoming:' + t, 6);
            const s =
              this.streamMessageController.fromStreamerMessages.getFromValue(
                t[0],
              );
            this.streamMessageController.fromStreamerHandlers.get(s)(e.data);
          }
          registerMessageHandlers() {
            this.streamMessageController.registerMessageHandler(
              Ie.FromStreamer,
              'QualityControlOwnership',
              (e) => this.onQualityControlOwnership(e),
            ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'Response',
                (e) => this.responseController.onResponse(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'Command',
                (e) => {
                  this.onCommand(e);
                },
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'FreezeFrame',
                (e) => this.onFreezeFrameMessage(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'UnfreezeFrame',
                () => this.invalidateFreezeFrameAndEnableVideo(),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'VideoEncoderAvgQP',
                (e) => this.handleVideoEncoderAvgQP(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'LatencyTest',
                (e) => this.handleLatencyTestResult(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'InitialSettings',
                (e) => this.handleInitialSettings(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'FileExtension',
                (e) => this.onFileExtension(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'FileMimeType',
                (e) => this.onFileMimeType(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'FileContents',
                (e) => this.onFileContents(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'TestEcho',
                () => {},
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'InputControlOwnership',
                (e) => this.onInputControlOwnership(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'GamepadResponse',
                (e) => this.onGamepadResponse(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.FromStreamer,
                'Protocol',
                (e) => this.onProtocolMessage(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'IFrameRequest',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'IFrameRequest',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'RequestQualityControl',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'RequestQualityControl',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'FpsRequest',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'FpsRequest',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'AverageBitrateRequest',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'AverageBitrateRequest',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'StartStreaming',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'StartStreaming',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'StopStreaming',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'StopStreaming',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'LatencyTest',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'LatencyTest',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'RequestInitialSettings',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'RequestInitialSettings',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'TestEcho',
                () => {},
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'UIInteraction',
                (e) => this.sendDescriptorController.emitUIInteraction(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'Command',
                (e) => this.sendDescriptorController.emitCommand(e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'KeyDown',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'KeyDown',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'KeyUp',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer('KeyUp', e),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'KeyPress',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'KeyPress',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseEnter',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseEnter',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseLeave',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseLeave',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseDown',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseDown',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseUp',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseUp',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseMove',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseMove',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseWheel',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseWheel',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'MouseDouble',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'MouseDouble',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'TouchStart',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'TouchStart',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'TouchEnd',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'TouchEnd',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'TouchMove',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'TouchMove',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'GamepadConnected',
                () =>
                  this.sendMessageController.sendMessageToStreamer(
                    'GamepadConnected',
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'GamepadButtonPressed',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'GamepadButtonPressed',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'GamepadButtonReleased',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'GamepadButtonReleased',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'GamepadAnalog',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'GamepadAnalog',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'GamepadDisconnected',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'GamepadDisconnected',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRHMDTransform',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRHMDTransform',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRControllerTransform',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRControllerTransform',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRSystem',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRSystem',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRButtonTouched',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRButtonTouched',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRButtonPressed',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRButtonPressed',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRButtonReleased',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRButtonReleased',
                    e,
                  ),
              ),
              this.streamMessageController.registerMessageHandler(
                Ie.ToStreamer,
                'XRAnalog',
                (e) =>
                  this.sendMessageController.sendMessageToStreamer(
                    'XRAnalog',
                    e,
                  ),
              );
          }
          onCommand(e) {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.Command',
              6,
            );
            const t = new TextDecoder('utf-16').decode(e.slice(1));
            l.Log(l.GetStackTrace(), 'Data Channel Command: ' + t, 6);
            const s = JSON.parse(t);
            'onScreenKeyboard' === s.command &&
              this.pixelStreaming._activateOnScreenKeyboard(s);
          }
          onProtocolMessage(e) {
            try {
              const t = new TextDecoder('utf-16').decode(e.slice(1)),
                s = JSON.parse(t);
              Object.prototype.hasOwnProperty.call(s, 'Direction') ||
                l.Error(
                  l.GetStackTrace(),
                  'Malformed protocol received. Ensure the protocol message contains a direction',
                );
              const n = s.Direction;
              delete s.Direction,
                l.Log(
                  l.GetStackTrace(),
                  `Received new ${
                    n == Ie.FromStreamer ? 'FromStreamer' : 'ToStreamer'
                  } protocol. Updating existing protocol...`,
                ),
                Object.keys(s).forEach((e) => {
                  const t = s[e];
                  switch (n) {
                    case Ie.ToStreamer:
                      if (
                        !Object.prototype.hasOwnProperty.call(t, 'id') ||
                        !Object.prototype.hasOwnProperty.call(t, 'byteLength')
                      )
                        return void l.Error(
                          l.GetStackTrace(),
                          `ToStreamer->${e} protocol definition was malformed as it didn't contain at least an id and a byteLength\n\n                                           Definition was: ${JSON.stringify(
                            t,
                            null,
                            2,
                          )}`,
                        );
                      if (
                        t.byteLength > 0 &&
                        !Object.prototype.hasOwnProperty.call(t, 'structure')
                      )
                        return void l.Error(
                          l.GetStackTrace(),
                          `ToStreamer->${e} protocol definition was malformed as it specified a byteLength but no accompanying structure`,
                        );
                      this.streamMessageController.toStreamerHandlers.get(e)
                        ? this.streamMessageController.toStreamerMessages.add(
                            e,
                            t,
                          )
                        : l.Error(
                            l.GetStackTrace(),
                            `There was no registered handler for "${e}" - try adding one using registerMessageHandler(MessageDirection.ToStreamer, "${e}", myHandler)`,
                          );
                      break;
                    case Ie.FromStreamer:
                      if (!Object.prototype.hasOwnProperty.call(t, 'id'))
                        return void l.Error(
                          l.GetStackTrace(),
                          `FromStreamer->${e} protocol definition was malformed as it didn't contain at least an id\n\n                            Definition was: ${JSON.stringify(
                            t,
                            null,
                            2,
                          )}`,
                        );
                      this.streamMessageController.fromStreamerHandlers.get(e)
                        ? this.streamMessageController.fromStreamerMessages.add(
                            e,
                            t.id,
                          )
                        : l.Error(
                            l.GetStackTrace(),
                            `There was no registered handler for "${t}" - try adding one using registerMessageHandler(MessageDirection.FromStreamer, "${e}", myHandler)`,
                          );
                      break;
                    default:
                      l.Error(l.GetStackTrace(), `Unknown direction: ${n}`);
                  }
                }),
                this.toStreamerMessagesController.SendRequestInitialSettings(),
                this.toStreamerMessagesController.SendRequestQualityControl();
            } catch (e) {
              l.Log(l.GetStackTrace(), e);
            }
          }
          onInputControlOwnership(e) {
            const t = new Uint8Array(e);
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.InputControlOwnership',
              6,
            );
            const s = new Boolean(t[1]).valueOf();
            l.Log(
              l.GetStackTrace(),
              `Received input controller message - will your input control the stream: ${s}`,
            ),
              this.pixelStreaming._onInputControlOwnership(s);
          }
          onGamepadResponse(e) {
            const t = new TextDecoder('utf-16').decode(e.slice(1)),
              s = JSON.parse(t);
            this.gamePadController.onGamepadResponseReceived(s.controllerId);
          }
          onAfkTriggered() {
            this.afkController.onAfkClick(),
              this.videoPlayer.isPaused() &&
                this.videoPlayer.hasVideoSource() &&
                this.playStream();
          }
          setAfkEnabled(e) {
            e
              ? this.onAfkTriggered()
              : this.afkController.stopAfkWarningTimer();
          }
          restartStreamAutomatically() {
            if (this.webSocketController)
              if (
                this.webSocketController.webSocket &&
                this.webSocketController.webSocket.readyState !==
                  WebSocket.CLOSED
              ) {
                (this.pixelStreaming._showActionOrErrorOnDisconnect = !1),
                  this.setDisconnectMessageOverride('Restarting stream...'),
                  this.closeSignalingServer();
                const e = setTimeout(() => {
                  this.pixelStreaming._onWebRtcAutoConnect(),
                    this.connectToSignallingServer(),
                    clearTimeout(e);
                }, 3e3);
              } else
                l.Log(
                  l.GetStackTrace(),
                  'A websocket connection has not been made yet so we will start the stream',
                ),
                  this.pixelStreaming._onWebRtcAutoConnect(),
                  this.connectToSignallingServer();
            else
              l.Log(
                l.GetStackTrace(),
                'The Web Socket Controller does not exist so this will not work right now.',
              );
          }
          loadFreezeFrameOrShowPlayOverlay() {
            this.pixelStreaming.dispatchEvent(
              new Z({
                shouldShowPlayOverlay: this.shouldShowPlayOverlay,
                isValid: this.freezeFrameController.valid,
                jpegData: this.freezeFrameController.jpeg,
              }),
            ),
              !0 === this.shouldShowPlayOverlay
                ? (l.Log(l.GetStackTrace(), 'showing play overlay'),
                  this.resizePlayerStyle())
                : (l.Log(l.GetStackTrace(), 'showing freeze frame'),
                  this.freezeFrameController.showFreezeFrame()),
              setTimeout(() => {
                this.videoPlayer.setVideoEnabled(!1);
              }, this.freezeFrameController.freezeFrameDelay);
          }
          onFreezeFrameMessage(e) {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.FreezeFrame',
              6,
            );
            const t = new Uint8Array(e);
            this.freezeFrameController.processFreezeFrameMessage(t, () =>
              this.loadFreezeFrameOrShowPlayOverlay(),
            );
          }
          invalidateFreezeFrameAndEnableVideo() {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.FreezeFrame',
              6,
            ),
              setTimeout(() => {
                this.pixelStreaming.dispatchEvent(new ee()),
                  this.freezeFrameController.hideFreezeFrame();
              }, this.freezeFrameController.freezeFrameDelay),
              this.videoPlayer.getVideoElement() &&
                this.videoPlayer.setVideoEnabled(!0);
          }
          onFileExtension(e) {
            const t = new Uint8Array(e);
            We.setExtensionFromBytes(t, this.file);
          }
          onFileMimeType(e) {
            const t = new Uint8Array(e);
            We.setMimeTypeFromBytes(t, this.file);
          }
          onFileContents(e) {
            const t = new Uint8Array(e);
            We.setContentsFromBytes(t, this.file);
          }
          playStream() {
            if (!this.videoPlayer.getVideoElement()) {
              const e =
                'Could not play video stream because the video player was not initialized correctly.';
              return (
                this.pixelStreaming.dispatchEvent(new j({ message: e })),
                l.Error(l.GetStackTrace(), e),
                this.setDisconnectMessageOverride(
                  'Stream not initialized correctly',
                ),
                void this.closeSignalingServer()
              );
            }
            this.videoPlayer.hasVideoSource()
              ? (this.setTouchInputEnabled(
                  this.config.isFlagEnabled(ce.TouchInput),
                ),
                this.pixelStreaming.dispatchEvent(new J()),
                this.streamController.audioElement.srcObject
                  ? ((this.streamController.audioElement.muted =
                      this.config.isFlagEnabled(ce.StartVideoMuted)),
                    this.streamController.audioElement
                      .play()
                      .then(() => {
                        this.playVideo();
                      })
                      .catch((e) => {
                        l.Log(l.GetStackTrace(), e),
                          l.Log(
                            l.GetStackTrace(),
                            'Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay.',
                          ),
                          this.pixelStreaming.dispatchEvent(
                            new Y({ reason: e }),
                          );
                      }))
                  : this.playVideo(),
                (this.shouldShowPlayOverlay = !1),
                this.freezeFrameController.showFreezeFrame())
              : l.Warning(
                  l.GetStackTrace(),
                  'Cannot play stream, the video element has no srcObject to play.',
                );
          }
          playVideo() {
            this.videoPlayer.play().catch((e) => {
              this.streamController.audioElement.srcObject &&
                this.streamController.audioElement.pause(),
                l.Log(l.GetStackTrace(), e),
                l.Log(
                  l.GetStackTrace(),
                  'Browser does not support autoplaying video without interaction - to resolve this we are going to show the play button overlay.',
                ),
                this.pixelStreaming.dispatchEvent(new Y({ reason: e }));
            });
          }
          autoPlayVideoOrSetUpPlayOverlay() {
            this.config.isFlagEnabled(ce.AutoPlayVideo) && this.playStream(),
              this.resizePlayerStyle();
          }
          connectToSignallingServer() {
            const e = this.signallingUrlBuilder();
            this.webSocketController.connect(e);
          }
          startSession(e) {
            if (
              ((this.peerConfig = e),
              this.config.isFlagEnabled(ce.ForceTURN) &&
                !this.checkTurnServerAvailability(e))
            )
              return (
                l.Info(
                  l.GetStackTrace(),
                  'No turn server was found in the Peer Connection Options. TURN cannot be forced, closing connection. Please use STUN instead',
                ),
                this.setDisconnectMessageOverride(
                  'TURN cannot be forced, closing connection. Please use STUN instead.',
                ),
                void this.closeSignalingServer()
              );
            (this.peerConnectionController = new Ge(
              this.peerConfig,
              this.config,
              this.preferredCodec,
            )),
              (this.peerConnectionController.onVideoStats = (e) =>
                this.handleVideoStats(e)),
              (this.peerConnectionController.onSendWebRTCOffer = (e) =>
                this.handleSendWebRTCOffer(e)),
              (this.peerConnectionController.onSendWebRTCAnswer = (e) =>
                this.handleSendWebRTCAnswer(e)),
              (this.peerConnectionController.onPeerIceCandidate = (e) =>
                this.handleSendIceCandidate(e)),
              (this.peerConnectionController.onDataChannel = (e) =>
                this.handleDataChannel(e)),
              (this.peerConnectionController.showTextOverlayConnecting = () =>
                this.pixelStreaming._onWebRtcConnecting()),
              (this.peerConnectionController.showTextOverlaySetupFailure = () =>
                this.pixelStreaming._onWebRtcFailed());
            let t = !1;
            (this.peerConnectionController.onIceConnectionStateChange = () => {
              !t &&
                ['connected', 'completed'].includes(
                  this.peerConnectionController.peerConnection
                    .iceConnectionState,
                ) &&
                (this.pixelStreaming._onWebRtcConnected(), (t = !0));
            }),
              (this.peerConnectionController.onTrack = (e) =>
                this.streamController.handleOnTrack(e)),
              this.config.isFlagEnabled(ce.BrowserSendOffer) &&
                (this.sendrecvDataChannelController.createDataChannel(
                  this.peerConnectionController.peerConnection,
                  'cirrus',
                  this.datachannelOptions,
                ),
                (this.sendrecvDataChannelController.handleOnMessage = (e) =>
                  this.handleOnMessage(e)),
                this.peerConnectionController.createOffer(
                  this.sdpConstraints,
                  this.config,
                ));
          }
          checkTurnServerAvailability(e) {
            if (!e.iceServers)
              return (
                l.Info(l.GetStackTrace(), 'A turn sever was not found'), !1
              );
            for (const t of e.iceServers)
              for (const e of t.urls)
                if (e.includes('turn'))
                  return (
                    l.Log(l.GetStackTrace(), `A turn sever was found at ${e}`),
                    !0
                  );
            return l.Info(l.GetStackTrace(), 'A turn sever was not found'), !1;
          }
          handleOnConfigMessage(e) {
            this.resizePlayerStyle(),
              this.startSession(e.peerConnectionOptions),
              (this.webSocketController.onWebRtcAnswer = (e) =>
                this.handleWebRtcAnswer(e)),
              (this.webSocketController.onWebRtcOffer = (e) =>
                this.handleWebRtcOffer(e)),
              (this.webSocketController.onWebRtcPeerDataChannels = (e) =>
                this.handleWebRtcSFUPeerDatachannels(e)),
              (this.webSocketController.onIceCandidate = (e) =>
                this.handleIceCandidate(e));
          }
          handleStreamerListMessage(e) {
            if (
              (l.Log(l.GetStackTrace(), `Got streamer list ${e.ids}`, 6),
              this.isReconnecting)
            )
              e.ids.includes(this.subscribedStream)
                ? ((this.isReconnecting = !1),
                  (this.reconnectAttempt = 0),
                  this.webSocketController.sendSubscribe(this.subscribedStream))
                : this.reconnectAttempt <
                  this.config.getNumericSettingValue(ue.MaxReconnectAttempts)
                ? (this.reconnectAttempt++,
                  setTimeout(() => {
                    this.webSocketController.requestStreamerList();
                  }, 2e3))
                : ((this.reconnectAttempt = 0),
                  (this.isReconnecting = !1),
                  (this.shouldReconnect = !1),
                  this.webSocketController.close(),
                  this.config.setOptionSettingValue(Se.StreamerId, ''),
                  this.config.setOptionSettingOptions(Se.StreamerId, []));
            else {
              const t = [...e.ids];
              t.unshift(''),
                this.config.setOptionSettingOptions(Se.StreamerId, t);
              const s = new URLSearchParams(window.location.search);
              let n = null;
              1 == e.ids.length
                ? (n = e.ids[0])
                : this.config.isFlagEnabled(ce.PreferSFU) &&
                  e.ids.includes('SFU')
                ? (n = 'SFU')
                : s.has(Se.StreamerId) &&
                  e.ids.includes(s.get(Se.StreamerId)) &&
                  (n = s.get(Se.StreamerId)),
                null !== n &&
                  this.config.setOptionSettingValue(Se.StreamerId, n),
                this.pixelStreaming.dispatchEvent(
                  new se({ messageStreamerList: e, autoSelectedStreamerId: n }),
                );
            }
          }
          handleWebRtcAnswer(e) {
            l.Log(l.GetStackTrace(), `Got answer sdp ${e.sdp}`, 6);
            const t = { sdp: e.sdp, type: 'answer' };
            this.peerConnectionController.receiveAnswer(t),
              this.handlePostWebrtcNegotiation();
          }
          handleWebRtcOffer(e) {
            l.Log(l.GetStackTrace(), `Got offer sdp ${e.sdp}`, 6),
              (this.isUsingSFU = !!e.sfu && e.sfu),
              this.isUsingSFU &&
                (this.peerConnectionController.preferredCodec = '');
            const t = { sdp: e.sdp, type: 'offer' };
            this.peerConnectionController.receiveOffer(t, this.config),
              this.handlePostWebrtcNegotiation();
          }
          handleWebRtcSFUPeerDatachannels(e) {
            const t = { ordered: !0, negotiated: !0, id: e.sendStreamId },
              s = e.sendStreamId != e.recvStreamId;
            if (
              (this.sendrecvDataChannelController.createDataChannel(
                this.peerConnectionController.peerConnection,
                s ? 'send-datachannel' : 'datachannel',
                t,
              ),
              s)
            ) {
              const t = { ordered: !0, negotiated: !0, id: e.recvStreamId };
              this.recvDataChannelController.createDataChannel(
                this.peerConnectionController.peerConnection,
                'recv-datachannel',
                t,
              ),
                (this.recvDataChannelController.handleOnOpen = () =>
                  this.webSocketController.sendSFURecvDataChannelReady()),
                (this.recvDataChannelController.handleOnMessage = (e) =>
                  this.handleOnMessage(e));
            } else
              this.sendrecvDataChannelController.handleOnMessage = (e) =>
                this.handleOnMessage(e);
          }
          handlePostWebrtcNegotiation() {
            this.afkController.startAfkWarningTimer(),
              this.pixelStreaming._onWebRtcSdp(),
              this.statsTimerHandle &&
                void 0 !== this.statsTimerHandle &&
                window.clearInterval(this.statsTimerHandle),
              (this.statsTimerHandle = window.setInterval(
                () => this.getStats(),
                1e3,
              )),
              this.setMouseInputEnabled(
                this.config.isFlagEnabled(ce.MouseInput),
              ),
              this.setKeyboardInputEnabled(
                this.config.isFlagEnabled(ce.KeyboardInput),
              ),
              this.setGamePadInputEnabled(
                this.config.isFlagEnabled(ce.GamepadInput),
              );
          }
          handleIceCandidate(e) {
            l.Log(l.GetStackTrace(), 'Web RTC Controller: onWebRtcIce', 6);
            const t = new RTCIceCandidate(e);
            this.peerConnectionController.handleOnIce(t);
          }
          handleSendIceCandidate(e) {
            l.Log(l.GetStackTrace(), 'OnIceCandidate', 6),
              e.candidate &&
                e.candidate.candidate &&
                this.webSocketController.sendIceCandidate(e.candidate);
          }
          handleDataChannel(e) {
            l.Log(
              l.GetStackTrace(),
              'Data channel created for us by browser as we are a receiving peer.',
              6,
            ),
              (this.sendrecvDataChannelController.dataChannel = e.channel),
              this.sendrecvDataChannelController.setupDataChannel(),
              (this.sendrecvDataChannelController.handleOnMessage = (e) =>
                this.handleOnMessage(e));
          }
          handleSendWebRTCOffer(e) {
            l.Log(l.GetStackTrace(), 'Sending the offer to the Server', 6),
              this.webSocketController.sendWebRtcOffer(e);
          }
          handleSendWebRTCAnswer(e) {
            l.Log(l.GetStackTrace(), 'Sending the answer to the Server', 6),
              this.webSocketController.sendWebRtcAnswer(e),
              this.isUsingSFU &&
                this.webSocketController.sendWebRtcDatachannelRequest();
          }
          setUpMouseAndFreezeFrame() {
            (this.videoElementParentClientRect = this.videoPlayer
              .getVideoParentElement()
              .getBoundingClientRect()),
              this.coordinateConverter.setupNormalizeAndQuantize(),
              this.freezeFrameController.freezeFrame.resize();
          }
          closeSignalingServer() {
            var e;
            (this.shouldReconnect = !1),
              null === (e = this.webSocketController) ||
                void 0 === e ||
                e.close();
          }
          closePeerConnection() {
            var e;
            null === (e = this.peerConnectionController) ||
              void 0 === e ||
              e.close();
          }
          close() {
            this.closeSignalingServer(), this.closePeerConnection();
          }
          getStats() {
            this.peerConnectionController.generateStats();
          }
          sendLatencyTest() {
            (this.latencyStartTime = Date.now()),
              this.sendDescriptorController.sendLatencyTest({
                StartTime: this.latencyStartTime,
              });
          }
          sendEncoderMinQP(e) {
            l.Log(l.GetStackTrace(), `MinQP=${e}\n`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  'Encoder.MinQP': e,
                });
          }
          sendEncoderMaxQP(e) {
            l.Log(l.GetStackTrace(), `MaxQP=${e}\n`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  'Encoder.MaxQP': e,
                });
          }
          sendWebRTCMinBitrate(e) {
            l.Log(l.GetStackTrace(), `WebRTC Min Bitrate=${e}`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  'WebRTC.MinBitrate': e,
                });
          }
          sendWebRTCMaxBitrate(e) {
            l.Log(l.GetStackTrace(), `WebRTC Max Bitrate=${e}`, 6),
              null != e &&
                this.sendDescriptorController.emitCommand({
                  'WebRTC.MaxBitrate': e,
                });
          }
          sendWebRTCFps(e) {
            l.Log(l.GetStackTrace(), `WebRTC FPS=${e}`, 6),
              null != e &&
                (this.sendDescriptorController.emitCommand({ 'WebRTC.Fps': e }),
                this.sendDescriptorController.emitCommand({
                  'WebRTC.MaxFps': e,
                }));
          }
          sendShowFps() {
            l.Log(
              l.GetStackTrace(),
              '----   Sending show stat to UE   ----',
              6,
            ),
              this.sendDescriptorController.emitCommand({ 'stat.fps': '' });
          }
          sendIframeRequest() {
            l.Log(
              l.GetStackTrace(),
              '----   Sending Request for an IFrame  ----',
              6,
            ),
              this.streamMessageController.toStreamerHandlers.get(
                'IFrameRequest',
              )();
          }
          emitUIInteraction(e) {
            l.Log(
              l.GetStackTrace(),
              '----   Sending custom UIInteraction message   ----',
              6,
            ),
              this.sendDescriptorController.emitUIInteraction(e);
          }
          emitCommand(e) {
            l.Log(
              l.GetStackTrace(),
              '----   Sending custom Command message   ----',
              6,
            ),
              this.sendDescriptorController.emitCommand(e);
          }
          emitConsoleCommand(e) {
            l.Log(
              l.GetStackTrace(),
              '----   Sending custom Command:ConsoleCommand message   ----',
              6,
            ),
              this.sendDescriptorController.emitCommand({ ConsoleCommand: e });
          }
          sendRequestQualityControlOwnership() {
            l.Log(
              l.GetStackTrace(),
              '----   Sending Request to Control Quality  ----',
              6,
            ),
              this.toStreamerMessagesController.SendRequestQualityControl();
          }
          handleLatencyTestResult(e) {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.latencyTest',
              6,
            );
            const t = new TextDecoder('utf-16').decode(e.slice(1)),
              s = new Ve();
            Object.assign(s, JSON.parse(t)),
              s.processFields(),
              (s.testStartTimeMs = this.latencyStartTime),
              (s.browserReceiptTimeMs = Date.now()),
              (s.latencyExcludingDecode = ~~(
                s.browserReceiptTimeMs - s.testStartTimeMs
              )),
              (s.testDuration = ~~(s.TransmissionTimeMs - s.ReceiptTimeMs)),
              (s.networkLatency = ~~(
                s.latencyExcludingDecode - s.testDuration
              )),
              s.frameDisplayDeltaTimeMs &&
                s.browserReceiptTimeMs &&
                (s.endToEndLatency =
                  (s.frameDisplayDeltaTimeMs,
                  s.networkLatency,
                  ~~+s.CaptureToSendMs)),
              this.pixelStreaming._onLatencyTestResult(s);
          }
          handleInitialSettings(e) {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.InitialSettings',
              6,
            );
            const t = new TextDecoder('utf-16').decode(e.slice(1)),
              s = JSON.parse(t),
              n = new ze();
            s.Encoder && (n.EncoderSettings = s.Encoder),
              s.WebRTC && (n.WebRTCSettings = s.WebRTC),
              s.PixelStreaming && (n.PixelStreamingSettings = s.PixelStreaming),
              s.ConfigOptions &&
                void 0 !== s.ConfigOptions.DefaultToHover &&
                this.config.setFlagEnabled(
                  ce.HoveringMouseMode,
                  !!s.ConfigOptions.DefaultToHover,
                ),
              n.ueCompatible(),
              l.Log(l.GetStackTrace(), t, 6),
              this.pixelStreaming._onInitialSettings(n);
          }
          handleVideoEncoderAvgQP(e) {
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.VideoEncoderAvgQP',
              6,
            );
            const t = Number(new TextDecoder('utf-16').decode(e.slice(1)));
            this.setVideoEncoderAvgQP(t);
          }
          handleVideoInitialized() {
            this.pixelStreaming._onVideoInitialized(),
              this.autoPlayVideoOrSetUpPlayOverlay(),
              this.resizePlayerStyle(),
              this.videoPlayer.updateVideoStreamSize();
          }
          onQualityControlOwnership(e) {
            const t = new Uint8Array(e);
            l.Log(
              l.GetStackTrace(),
              'DataChannelReceiveMessageType.QualityControlOwnership',
              6,
            ),
              (this.isQualityController = new Boolean(t[1]).valueOf()),
              l.Log(
                l.GetStackTrace(),
                `Received quality controller message, will control quality: ${this.isQualityController}`,
              ),
              this.pixelStreaming._onQualityControlOwnership(
                this.isQualityController,
              );
          }
          handleVideoStats(e) {
            this.pixelStreaming._onVideoStats(e);
          }
          resizePlayerStyle() {
            this.videoPlayer.resizePlayerStyle();
          }
          getDisconnectMessageOverride() {
            return this.disconnectMessageOverride;
          }
          setDisconnectMessageOverride(e) {
            this.disconnectMessageOverride = e;
          }
          setPreferredCodec(e) {
            (this.preferredCodec = e),
              this.peerConnectionController &&
                ((this.peerConnectionController.preferredCodec = e),
                (this.peerConnectionController.updateCodecSelection = !1));
          }
          setVideoEncoderAvgQP(e) {
            (this.videoAvgQp = e),
              this.pixelStreaming._onVideoEncoderAvgQP(this.videoAvgQp);
          }
          setKeyboardInputEnabled(e) {
            var t;
            null === (t = this.keyboardController) ||
              void 0 === t ||
              t.unregisterKeyBoardEvents(),
              e &&
                (this.keyboardController =
                  this.inputClassesFactory.registerKeyBoard(this.config));
          }
          setMouseInputEnabled(e) {
            var t;
            if (
              (null === (t = this.mouseController) ||
                void 0 === t ||
                t.unregisterMouseEvents(),
              e)
            ) {
              const e = this.config.isFlagEnabled(ce.HoveringMouseMode)
                ? Ce.HoveringMouse
                : Ce.LockedMouse;
              this.mouseController = this.inputClassesFactory.registerMouse(e);
            }
          }
          setTouchInputEnabled(e) {
            var t;
            null === (t = this.touchController) ||
              void 0 === t ||
              t.unregisterTouchEvents(),
              e &&
                (this.touchController = this.inputClassesFactory.registerTouch(
                  this.config.isFlagEnabled(ce.FakeMouseWithTouches),
                  this.videoElementParentClientRect,
                ));
          }
          setGamePadInputEnabled(e) {
            var t;
            null === (t = this.gamePadController) ||
              void 0 === t ||
              t.unregisterGamePadEvents(),
              e &&
                ((this.gamePadController =
                  this.inputClassesFactory.registerGamePad()),
                (this.gamePadController.onGamepadConnected = () => {
                  this.streamMessageController.toStreamerHandlers.get(
                    'GamepadConnected',
                  )();
                }),
                (this.gamePadController.onGamepadDisconnected = (e) => {
                  this.streamMessageController.toStreamerHandlers.get(
                    'GamepadDisconnected',
                  )([e]);
                }));
          }
          registerDataChannelEventEmitters(e) {
            (e.onOpen = (e, t) =>
              this.pixelStreaming.dispatchEvent(new V({ label: e, event: t }))),
              (e.onClose = (e, t) =>
                this.pixelStreaming.dispatchEvent(
                  new W({ label: e, event: t }),
                )),
              (e.onError = (e, t) =>
                this.pixelStreaming.dispatchEvent(
                  new N({ label: e, event: t }),
                ));
          }
        }
        class ft {
          static vertexShader() {
            return '\n\t\tattribute vec2 a_position;\n\t\tattribute vec2 a_texCoord;\n\n\t\t// input\n\t\tuniform vec2 u_resolution;\n\t\tuniform vec4 u_offset;\n\n\t\t//\n\t\tvarying vec2 v_texCoord;\n\n\t\tvoid main() {\n\t\t   // convert the rectangle from pixels to 0.0 to 1.0\n\t\t   vec2 zeroToOne = a_position / u_resolution;\n\n\t\t   // convert from 0->1 to 0->2\n\t\t   vec2 zeroToTwo = zeroToOne * 2.0;\n\n\t\t   // convert from 0->2 to -1->+1 (clipspace)\n\t\t   vec2 clipSpace = zeroToTwo - 1.0;\n\n\t\t   gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n\t\t   // pass the texCoord to the fragment shader\n\t\t   // The GPU will interpolate this value between points.\n\t\t   v_texCoord = (a_texCoord * u_offset.xy) + u_offset.zw;\n\t\t}\n\t\t';
          }
          static fragmentShader() {
            return '\n\t\tprecision mediump float;\n\n\t\t// our texture\n\t\tuniform sampler2D u_image;\n\n\t\t// the texCoords passed in from the vertex shader.\n\t\tvarying vec2 v_texCoord;\n\n\t\tvoid main() {\n\t\t   gl_FragColor = texture2D(u_image, v_texCoord);\n\t\t}\n\t\t';
          }
        }
        class Ct {
          static deepCopyGamepad(e) {
            return JSON.parse(
              JSON.stringify({
                buttons: e.buttons.map((e) =>
                  JSON.parse(
                    JSON.stringify({ pressed: e.pressed, touched: e.touched }),
                  ),
                ),
                axes: e.axes,
              }),
            );
          }
        }
        class yt {
          constructor(e) {
            (this.toStreamerMessagesProvider = e), (this.controllers = []);
          }
          updateStatus(e, t, s) {
            if (e.gamepad) {
              const n = t.getPose(e.gripSpace, s);
              if (!n) return;
              let r = 0;
              e.profiles.includes('htc-vive')
                ? (r = 1)
                : e.profiles.includes('oculus-touch') && (r = 2),
                this.toStreamerMessagesProvider.toStreamerHandlers.get(
                  'XRSystem',
                )([r]);
              let i = 2;
              switch (e.handedness) {
                case 'left':
                  i = 0;
                  break;
                case 'right':
                  i = 1;
              }
              const o = n.transform.matrix,
                a = [];
              for (let e = 0; e < 16; e++) a[e] = new Float32Array([o[e]])[0];
              this.toStreamerMessagesProvider.toStreamerHandlers.get(
                'XRControllerTransform',
              )([
                a[0],
                a[4],
                a[8],
                a[12],
                a[1],
                a[5],
                a[9],
                a[13],
                a[2],
                a[6],
                a[10],
                a[14],
                a[3],
                a[7],
                a[11],
                a[15],
                i,
              ]),
                void 0 === this.controllers[i] &&
                  ((this.controllers[i] = {
                    prevState: void 0,
                    currentState: void 0,
                    id: void 0,
                  }),
                  (this.controllers[i].prevState = Ct.deepCopyGamepad(
                    e.gamepad,
                  ))),
                (this.controllers[i].currentState = Ct.deepCopyGamepad(
                  e.gamepad,
                ));
              const l = this.controllers[i],
                d = l.currentState,
                c = l.prevState;
              for (let e = 0; e < d.buttons.length; e++) {
                const t = d.buttons[e],
                  s = c.buttons[e];
                t.pressed
                  ? this.toStreamerMessagesProvider.toStreamerHandlers.get(
                      'XRButtonPressed',
                    )([i, e, s.pressed ? 1 : 0])
                  : !t.pressed &&
                    s.pressed &&
                    this.toStreamerMessagesProvider.toStreamerHandlers.get(
                      'XRButtonReleased',
                    )([i, e, 0]),
                  t.touched && !t.pressed
                    ? this.toStreamerMessagesProvider.toStreamerHandlers.get(
                        'XRButtonPressed',
                      )([i, 3, s.touched ? 1 : 0])
                    : !t.touched &&
                      s.touched &&
                      this.toStreamerMessagesProvider.toStreamerHandlers.get(
                        'XRButtonReleased',
                      )([i, 3, 0]);
              }
              for (let e = 0; e < d.axes.length; e++)
                this.toStreamerMessagesProvider.toStreamerHandlers.get(
                  'XRAnalog',
                )([i, e, d.axes[e]]);
              this.controllers[i].prevState = d;
            }
          }
        }
        class Tt {
          constructor(e) {
            (this.xrSession = null),
              (this.webRtcController = e),
              (this.xrControllers = []),
              (this.xrGamepadController = new yt(
                this.webRtcController.streamMessageController,
              )),
              (this.onSessionEnded = new EventTarget()),
              (this.onSessionStarted = new EventTarget()),
              (this.onFrame = new EventTarget());
          }
          xrClicked() {
            this.xrSession
              ? this.xrSession.end()
              : navigator.xr.requestSession('immersive-vr').then((e) => {
                  this.onXrSessionStarted(e);
                });
          }
          onXrSessionEnded() {
            l.Log(l.GetStackTrace(), 'XR Session ended'),
              (this.xrSession = null),
              this.onSessionEnded.dispatchEvent(new Event('xrSessionEnded'));
          }
          onXrSessionStarted(e) {
            l.Log(l.GetStackTrace(), 'XR Session started'),
              (this.xrSession = e),
              this.xrSession.addEventListener('end', () => {
                this.onXrSessionEnded();
              });
            const t = document.createElement('canvas');
            (this.gl = t.getContext('webgl2', { xrCompatible: !0 })),
              this.xrSession.updateRenderState({
                baseLayer: new XRWebGLLayer(this.xrSession, this.gl),
              });
            const s = this.gl.createShader(this.gl.VERTEX_SHADER);
            this.gl.shaderSource(s, ft.vertexShader()),
              this.gl.compileShader(s);
            const n = this.gl.createShader(this.gl.FRAGMENT_SHADER);
            this.gl.shaderSource(n, ft.fragmentShader()),
              this.gl.compileShader(n);
            const r = this.gl.createProgram();
            this.gl.attachShader(r, s),
              this.gl.attachShader(r, n),
              this.gl.linkProgram(r),
              this.gl.useProgram(r),
              (this.positionLocation = this.gl.getAttribLocation(
                r,
                'a_position',
              )),
              (this.texcoordLocation = this.gl.getAttribLocation(
                r,
                'a_texCoord',
              )),
              (this.positionBuffer = this.gl.createBuffer()),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer),
              this.gl.enableVertexAttribArray(this.positionLocation);
            const i = this.gl.createTexture();
            this.gl.bindTexture(this.gl.TEXTURE_2D, i),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_WRAP_S,
                this.gl.CLAMP_TO_EDGE,
              ),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_WRAP_T,
                this.gl.CLAMP_TO_EDGE,
              ),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MIN_FILTER,
                this.gl.NEAREST,
              ),
              this.gl.texParameteri(
                this.gl.TEXTURE_2D,
                this.gl.TEXTURE_MAG_FILTER,
                this.gl.NEAREST,
              ),
              (this.texcoordBuffer = this.gl.createBuffer()),
              (this.resolutionLocation = this.gl.getUniformLocation(
                r,
                'u_resolution',
              )),
              (this.offsetLocation = this.gl.getUniformLocation(r, 'u_offset')),
              e.requestReferenceSpace('local').then((e) => {
                (this.xrRefSpace = e),
                  this.xrSession.requestAnimationFrame((e, t) =>
                    this.onXrFrame(e, t),
                  );
              }),
              this.onSessionStarted.dispatchEvent(
                new Event('xrSessionStarted'),
              );
          }
          onXrFrame(e, t) {
            const s = t.getViewerPose(this.xrRefSpace);
            if (s) {
              const e = s.transform.matrix,
                t = [];
              for (let s = 0; s < 16; s++) t[s] = new Float32Array([e[s]])[0];
              this.webRtcController.streamMessageController.toStreamerHandlers.get(
                'XRHMDTransform',
              )([
                t[0],
                t[4],
                t[8],
                t[12],
                t[1],
                t[5],
                t[9],
                t[13],
                t[2],
                t[6],
                t[10],
                t[14],
                t[3],
                t[7],
                t[11],
                t[15],
              ]);
              const n = this.xrSession.renderState.baseLayer;
              this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, n.framebuffer),
                this.gl.texImage2D(
                  this.gl.TEXTURE_2D,
                  0,
                  this.gl.RGBA,
                  this.gl.RGBA,
                  this.gl.UNSIGNED_BYTE,
                  this.webRtcController.videoPlayer.getVideoElement(),
                ),
                this.render(
                  this.webRtcController.videoPlayer.getVideoElement(),
                );
            }
            this.webRtcController.config.isFlagEnabled(ce.XRControllerInput) &&
              this.xrSession.inputSources.forEach((e, s, n) => {
                this.xrGamepadController.updateStatus(e, t, this.xrRefSpace);
              }, this),
              this.xrSession.requestAnimationFrame((e, t) =>
                this.onXrFrame(e, t),
              ),
              this.onFrame.dispatchEvent(new le({ time: e, frame: t }));
          }
          render(e) {
            if (!this.gl) return;
            const t = this.xrSession.renderState.baseLayer;
            let s, n, r, i, o;
            this.gl.viewport(0, 0, t.framebufferWidth, t.framebufferHeight),
              this.gl.uniform4f(this.offsetLocation, 1, 1, 0, 0),
              this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                new Float32Array([
                  0,
                  0,
                  e.videoWidth,
                  0,
                  0,
                  e.videoHeight,
                  0,
                  e.videoHeight,
                  e.videoWidth,
                  0,
                  e.videoWidth,
                  e.videoHeight,
                ]),
                this.gl.STATIC_DRAW,
              ),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer),
              this.gl.bufferData(
                this.gl.ARRAY_BUFFER,
                new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]),
                this.gl.STATIC_DRAW,
              ),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer),
              (s = 2),
              (n = this.gl.FLOAT),
              (r = !1),
              (i = 0),
              (o = 0),
              this.gl.vertexAttribPointer(this.positionLocation, s, n, r, i, o),
              this.gl.enableVertexAttribArray(this.texcoordLocation),
              this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.texcoordBuffer),
              (s = 2),
              (n = this.gl.FLOAT),
              (r = !1),
              (i = 0),
              (o = 0),
              this.gl.vertexAttribPointer(this.texcoordLocation, s, n, r, i, o),
              this.gl.uniform2f(
                this.resolutionLocation,
                e.videoWidth,
                e.videoHeight,
              );
            const a = this.gl.TRIANGLES;
            (o = 0), this.gl.drawArrays(a, o, 6);
          }
          static isSessionSupported(e) {
            return navigator.xr
              ? navigator.xr.isSessionSupported(e)
              : new Promise(() => !1);
          }
        }
        class Et {
          constructor(e) {
            (this.editTextButton = null),
              (this.hiddenInput = null),
              'ontouchstart' in document.documentElement &&
                this.createOnScreenKeyboardHelpers(e);
          }
          unquantizeAndDenormalizeUnsigned(e, t) {
            return null;
          }
          createOnScreenKeyboardHelpers(e) {
            this.hiddenInput ||
              ((this.hiddenInput = document.createElement('input')),
              (this.hiddenInput.id = 'hiddenInput'),
              (this.hiddenInput.maxLength = 0),
              e.appendChild(this.hiddenInput)),
              this.editTextButton ||
                ((this.editTextButton = document.createElement('button')),
                (this.editTextButton.id = 'editTextButton'),
                (this.editTextButton.innerHTML = 'edit text'),
                e.appendChild(this.editTextButton),
                this.editTextButton.classList.add('hiddenState'),
                this.editTextButton.addEventListener('touchend', (e) => {
                  this.hiddenInput.focus(), e.preventDefault();
                }));
          }
          showOnScreenKeyboard(e) {
            if (e.showOnScreenKeyboard) {
              this.editTextButton.classList.remove('hiddenState');
              const t = this.unquantizeAndDenormalizeUnsigned(e.x, e.y);
              (this.editTextButton.style.top = t.y.toString() + 'px'),
                (this.editTextButton.style.left = (t.x - 40).toString() + 'px');
            } else
              this.editTextButton.classList.add('hiddenState'),
                this.hiddenInput.blur();
          }
        }
        class bt {
          constructor(e, t) {
            (this._showActionOrErrorOnDisconnect = !0),
              (this.allowConsoleCommands = !1),
              (this.config = e),
              (null == t ? void 0 : t.videoElementParent) &&
                (this._videoElementParent = t.videoElementParent),
              (this._eventEmitter = new de()),
              this.configureSettings(),
              this.setWebRtcPlayerController(new vt(this.config, this)),
              (this.onScreenKeyboardHelper = new Et(this.videoElementParent)),
              (this.onScreenKeyboardHelper.unquantizeAndDenormalizeUnsigned = (
                e,
                t,
              ) =>
                this._webRtcController.requestUnquantizedAndDenormalizeUnsigned(
                  e,
                  t,
                )),
              (this._activateOnScreenKeyboard = (e) =>
                this.onScreenKeyboardHelper.showOnScreenKeyboard(e)),
              (this._webXrController = new Tt(this._webRtcController));
          }
          get videoElementParent() {
            return (
              this._videoElementParent ||
                ((this._videoElementParent = document.createElement('div')),
                (this._videoElementParent.id = 'videoElementParent')),
              this._videoElementParent
            );
          }
          configureSettings() {
            this.config._addOnSettingChangedListener(
              ce.IsQualityController,
              (e) => {
                !0 !== e ||
                  this._webRtcController.isQualityController ||
                  this._webRtcController.sendRequestQualityControlOwnership();
              },
            ),
              this.config._addOnSettingChangedListener(ce.AFKDetection, (e) => {
                this._webRtcController.setAfkEnabled(e);
              }),
              this.config._addOnSettingChangedListener(
                ce.MatchViewportResolution,
                () => {
                  this._webRtcController.videoPlayer.updateVideoStreamSize();
                },
              ),
              this.config._addOnSettingChangedListener(
                ce.HoveringMouseMode,
                (e) => {
                  this.config.setFlagLabel(
                    ce.HoveringMouseMode,
                    `Control Scheme: ${e ? 'Hovering' : 'Locked'} Mouse`,
                  ),
                    this._webRtcController.setMouseInputEnabled(
                      this.config.isFlagEnabled(ce.MouseInput),
                    );
                },
              ),
              this.config._addOnSettingChangedListener(
                ce.KeyboardInput,
                (e) => {
                  this._webRtcController.setKeyboardInputEnabled(e);
                },
              ),
              this.config._addOnSettingChangedListener(ce.MouseInput, (e) => {
                this._webRtcController.setMouseInputEnabled(e);
              }),
              this.config._addOnSettingChangedListener(ce.TouchInput, (e) => {
                this._webRtcController.setTouchInputEnabled(e);
              }),
              this.config._addOnSettingChangedListener(ce.GamepadInput, (e) => {
                this._webRtcController.setGamePadInputEnabled(e);
              }),
              this.config._addOnNumericSettingChangedListener(ue.MinQP, (e) => {
                l.Log(
                  l.GetStackTrace(),
                  '--------  Sending MinQP  --------',
                  7,
                ),
                  this._webRtcController.sendEncoderMinQP(e),
                  l.Log(
                    l.GetStackTrace(),
                    '-------------------------------------------',
                    7,
                  );
              }),
              this.config._addOnNumericSettingChangedListener(ue.MaxQP, (e) => {
                l.Log(
                  l.GetStackTrace(),
                  '--------  Sending encoder settings  --------',
                  7,
                ),
                  this._webRtcController.sendEncoderMaxQP(e),
                  l.Log(
                    l.GetStackTrace(),
                    '-------------------------------------------',
                    7,
                  );
              }),
              this.config._addOnNumericSettingChangedListener(
                ue.WebRTCMinBitrate,
                (e) => {
                  l.Log(
                    l.GetStackTrace(),
                    '--------  Sending web rtc settings  --------',
                    7,
                  ),
                    this._webRtcController.sendWebRTCMinBitrate(1e3 * e),
                    l.Log(
                      l.GetStackTrace(),
                      '-------------------------------------------',
                      7,
                    );
                },
              ),
              this.config._addOnNumericSettingChangedListener(
                ue.WebRTCMaxBitrate,
                (e) => {
                  l.Log(
                    l.GetStackTrace(),
                    '--------  Sending web rtc settings  --------',
                    7,
                  ),
                    this._webRtcController.sendWebRTCMaxBitrate(1e3 * e),
                    l.Log(
                      l.GetStackTrace(),
                      '-------------------------------------------',
                      7,
                    );
                },
              ),
              this.config._addOnNumericSettingChangedListener(
                ue.WebRTCFPS,
                (e) => {
                  l.Log(
                    l.GetStackTrace(),
                    '--------  Sending web rtc settings  --------',
                    7,
                  ),
                    this._webRtcController.sendWebRTCFps(e),
                    l.Log(
                      l.GetStackTrace(),
                      '-------------------------------------------',
                      7,
                    );
                },
              ),
              this.config._addOnOptionSettingChangedListener(
                Se.PreferredCodec,
                (e) => {
                  this._webRtcController &&
                    this._webRtcController.setPreferredCodec(e);
                },
              ),
              this.config._registerOnChangeEvents(this._eventEmitter);
          }
          _activateOnScreenKeyboard(e) {
            throw new Error('Method not implemented.');
          }
          _onInputControlOwnership(e) {
            this._inputController = e;
          }
          setWebRtcPlayerController(e) {
            (this._webRtcController = e),
              this._webRtcController.setPreferredCodec(
                this.config.getSettingOption(Se.PreferredCodec).selected,
              ),
              this._webRtcController.resizePlayerStyle(),
              this.checkForAutoConnect();
          }
          connect() {
            this._eventEmitter.dispatchEvent(new $()),
              this._webRtcController.connectToSignallingServer();
          }
          reconnect() {
            this._eventEmitter.dispatchEvent(new X()),
              this._webRtcController.restartStreamAutomatically();
          }
          disconnect() {
            this._eventEmitter.dispatchEvent(new q()),
              this._webRtcController.close();
          }
          play() {
            this._onStreamLoading(), this._webRtcController.playStream();
          }
          checkForAutoConnect() {
            this.config.isFlagEnabled(ce.AutoConnect) &&
              (this._onWebRtcAutoConnect(),
              this._webRtcController.connectToSignallingServer());
          }
          _onWebRtcAutoConnect() {
            this._eventEmitter.dispatchEvent(new G()),
              (this._showActionOrErrorOnDisconnect = !0);
          }
          _onWebRtcSdp() {
            this._eventEmitter.dispatchEvent(new U());
          }
          _onStreamLoading() {
            this._eventEmitter.dispatchEvent(new Q());
          }
          _onDisconnect(e) {
            '' != this._webRtcController.getDisconnectMessageOverride() &&
              void 0 !==
                this._webRtcController.getDisconnectMessageOverride() &&
              null != this._webRtcController.getDisconnectMessageOverride() &&
              ((e = this._webRtcController.getDisconnectMessageOverride()),
              this._webRtcController.setDisconnectMessageOverride('')),
              this._eventEmitter.dispatchEvent(
                new H({
                  eventString: e,
                  showActionOrErrorOnDisconnect:
                    this._showActionOrErrorOnDisconnect,
                }),
              ),
              0 == this._showActionOrErrorOnDisconnect &&
                (this._showActionOrErrorOnDisconnect = !0);
          }
          _onWebRtcConnecting() {
            this._eventEmitter.dispatchEvent(new z());
          }
          _onWebRtcConnected() {
            this._eventEmitter.dispatchEvent(new B());
          }
          _onWebRtcFailed() {
            this._eventEmitter.dispatchEvent(new _());
          }
          _onVideoInitialized() {
            this._eventEmitter.dispatchEvent(new K()),
              (this._videoStartTime = Date.now());
          }
          _onLatencyTestResult(e) {
            this._eventEmitter.dispatchEvent(new ne({ latencyTimings: e }));
          }
          _onVideoStats(e) {
            (this._videoStartTime && void 0 !== this._videoStartTime) ||
              (this._videoStartTime = Date.now()),
              e.handleSessionStatistics(
                this._videoStartTime,
                this._inputController,
                this._webRtcController.videoAvgQp,
              ),
              this._eventEmitter.dispatchEvent(new te({ aggregatedStats: e }));
          }
          _onVideoEncoderAvgQP(e) {
            this._eventEmitter.dispatchEvent(new I({ avgQP: e }));
          }
          _onInitialSettings(e) {
            var t;
            this._eventEmitter.dispatchEvent(new re({ settings: e })),
              e.PixelStreamingSettings &&
                ((this.allowConsoleCommands =
                  null !==
                    (t =
                      e.PixelStreamingSettings.AllowPixelStreamingCommands) &&
                  void 0 !== t &&
                  t),
                !1 === this.allowConsoleCommands &&
                  l.Info(
                    l.GetStackTrace(),
                    '-AllowPixelStreamingCommands=false, sending arbitrary console commands from browser to UE is disabled.',
                  ));
            const s = this.config.useUrlParams,
              n = new URLSearchParams(window.location.search);
            e.EncoderSettings &&
              (this.config.setNumericSetting(
                ue.MinQP,
                s && n.has(ue.MinQP)
                  ? Number.parseInt(n.get(ue.MinQP))
                  : e.EncoderSettings.MinQP,
              ),
              this.config.setNumericSetting(
                ue.MaxQP,
                s && n.has(ue.MaxQP)
                  ? Number.parseInt(n.get(ue.MaxQP))
                  : e.EncoderSettings.MaxQP,
              )),
              e.WebRTCSettings &&
                (this.config.setNumericSetting(
                  ue.WebRTCMinBitrate,
                  s && n.has(ue.WebRTCMinBitrate)
                    ? Number.parseInt(n.get(ue.WebRTCMinBitrate)) / 1e3
                    : e.WebRTCSettings.MinBitrate / 1e3,
                ),
                this.config.setNumericSetting(
                  ue.WebRTCMaxBitrate,
                  s && n.has(ue.WebRTCMaxBitrate)
                    ? Number.parseInt(n.get(ue.WebRTCMaxBitrate)) / 1e3
                    : e.WebRTCSettings.MaxBitrate / 1e3,
                ),
                this.config.setNumericSetting(
                  ue.WebRTCFPS,
                  s && n.has(ue.WebRTCFPS)
                    ? Number.parseInt(n.get(ue.WebRTCFPS))
                    : e.WebRTCSettings.FPS,
                ));
          }
          _onQualityControlOwnership(e) {
            this.config.setFlagEnabled(ce.IsQualityController, e);
          }
          requestLatencyTest() {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.sendLatencyTest(), !0)
            );
          }
          requestShowFps() {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.sendShowFps(), !0)
            );
          }
          requestIframe() {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.sendIframeRequest(), !0)
            );
          }
          emitUIInteraction(e) {
            return (
              !!this._webRtcController.videoPlayer.isVideoReady() &&
              (this._webRtcController.emitUIInteraction(e), !0)
            );
          }
          emitCommand(e) {
            return !(
              !this._webRtcController.videoPlayer.isVideoReady() ||
              (!this.allowConsoleCommands && 'ConsoleCommand' in e) ||
              (this._webRtcController.emitCommand(e), 0)
            );
          }
          emitConsoleCommand(e) {
            return !(
              !this.allowConsoleCommands ||
              !this._webRtcController.videoPlayer.isVideoReady() ||
              (this._webRtcController.emitConsoleCommand(e), 0)
            );
          }
          addResponseEventListener(e, t) {
            this._webRtcController.responseController.addResponseEventListener(
              e,
              t,
            );
          }
          removeResponseEventListener(e) {
            this._webRtcController.responseController.removeResponseEventListener(
              e,
            );
          }
          dispatchEvent(e) {
            return this._eventEmitter.dispatchEvent(e);
          }
          addEventListener(e, t) {
            this._eventEmitter.addEventListener(e, t);
          }
          removeEventListener(e, t) {
            this._eventEmitter.removeEventListener(e, t);
          }
          toggleXR() {
            this.webXrController.xrClicked();
          }
          setSignallingUrlBuilder(e) {
            this._webRtcController.signallingUrlBuilder = e;
          }
          get webSocketController() {
            return this._webRtcController.webSocketController;
          }
          get webXrController() {
            return this._webXrController;
          }
        }
        var Mt = a.De,
          wt = a.g;
        document.body.onload = function () {
          var e = new Mt({
              initialSettings: {
                AutoPlayVideo: !0,
                AutoConnect: !0,
                ss: 'ws://localhost:80',
                StartVideoMuted: !0,
              },
            }),
            t = new wt(e, {
              videoElementParent: document.getElementById('videoParentElement'),
            });
          t.addEventListener('playStreamRejected', function () {
            var e = document.getElementById('clickToPlayElement');
            (e.className = 'visible'),
              (e.onclick = function () {
                t.play(), (e.className = ''), (e.onclick = void 0);
              });
          });
        };
      })(),
      n
    );
  })(),
);
