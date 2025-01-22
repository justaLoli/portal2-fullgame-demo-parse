var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/@nekz/sdp/esm/src/types/CmdInfo.js
var CmdInfo = class {
  constructor() {
    Object.defineProperty(this, "flags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewOrigin", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewAngles", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "localViewAngles", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewOrigin2", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewAngles2", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "localViewAngles2", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.flags = buf.readInt32();
    this.viewOrigin = buf.readVector();
    this.viewAngles = buf.readQAngle();
    this.localViewAngles = buf.readQAngle();
    this.viewOrigin2 = buf.readVector();
    this.viewAngles2 = buf.readQAngle();
    this.localViewAngles2 = buf.readQAngle();
    return this;
  }
  write(buf) {
    buf.writeInt32(this.flags);
    buf.writeVector(this.viewOrigin);
    buf.writeQAngle(this.viewAngles);
    buf.writeQAngle(this.localViewAngles);
    buf.writeVector(this.viewOrigin2);
    buf.writeQAngle(this.viewAngles2);
    buf.writeQAngle(this.localViewAngles2);
    return this;
  }
};

// node_modules/@nekz/sdp/esm/src/types/DataTables.js
var DataTables_exports = {};
__export(DataTables_exports, {
  SendProp: () => SendProp,
  SendPropFlags: () => SendPropFlags,
  SendPropType: () => SendPropType,
  SendTable: () => SendTable,
  ServerClassInfo: () => ServerClassInfo
});
var SendPropType = {
  Int: 0,
  Float: 1,
  Vector: 2,
  VectorXy: 3,
  String: 4,
  Array: 5,
  SendTable: 6,
  Int64: 7
};
var SendPropFlags = {
  Unsigned: 1 << 0,
  Coord: 1 << 1,
  Noscale: 1 << 2,
  Rounddown: 1 << 3,
  Roundup: 1 << 4,
  Normal: 1 << 5,
  Exclude: 1 << 6,
  Xyze: 1 << 7,
  InsideArray: 1 << 8,
  ProxyAlwaysYes: 1 << 9,
  IsAVectorElem: 1 << 10,
  Collapsible: 1 << 11,
  CoordMp: 1 << 12,
  CoordMpLowPrecision: 1 << 13,
  CoordMpIntegral: 1 << 14,
  CellCoord: 1 << 15,
  CellCoordLowPrecision: 1 << 16,
  CellCoordIntegral: 1 << 17,
  ChangesOften: 1 << 18,
  VarInt: 1 << 19
};
var SendTable = class {
  constructor() {
    Object.defineProperty(this, "needsDecoder", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "netTableName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "props", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.needsDecoder = buf.readBoolean();
    this.netTableName = buf.readASCIIString();
    this.props = [];
    let props = buf.readBits(10, false);
    while (props--) {
      const prop = new SendProp();
      prop.read(buf, demo);
      this.props.push(prop);
    }
  }
  write(buf, demo) {
    var _a;
    buf.writeBoolean(this.needsDecoder);
    buf.writeASCIIString(this.netTableName);
    buf.writeBits(this.props.length, 10);
    (_a = this.props) == null ? void 0 : _a.forEach((prop) => prop.write(buf, demo));
  }
};
var SendProp = class {
  constructor() {
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "varName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "flags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "excludeDtName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lowValue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "highValue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numBits", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "elements", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.type = buf.readBits(5, false);
    this.varName = buf.readASCIIString();
    this.flags = buf.readBits(demo.demoProtocol === 2 ? 11 : 16, false);
    if (demo.isPortal2Engine) {
      this.unk = buf.readBits(11, false);
    }
    if (this.type === SendPropType.SendTable || (this.flags & SendPropFlags.Exclude) !== 0) {
      this.excludeDtName = buf.readASCIIString();
    } else if (this.type === SendPropType.String || this.type === SendPropType.Int || this.type === SendPropType.Float || this.type === SendPropType.Vector || this.type === SendPropType.VectorXy) {
      this.lowValue = buf.readFloat32();
      this.highValue = buf.readFloat32();
      this.numBits = buf.readBits(7, false);
    } else if (this.type === SendPropType.Array) {
      this.elements = buf.readBits(10, false);
    } else {
      throw new Error("Invalid prop type: " + this.type);
    }
  }
  write(buf, demo) {
    buf.writeBits(this.type, 5);
    buf.writeASCIIString(this.varName);
    buf.writeBits(this.flags, demo.demoProtocol === 2 ? 11 : 16);
    if (demo.isPortal2Engine) {
      buf.writeBits(this.unk, 11);
    }
    if (this.type === SendPropType.SendTable || (this.flags & SendPropFlags.Exclude) !== 0) {
      buf.writeASCIIString(this.excludeDtName);
    } else if (this.type === SendPropType.String || this.type === SendPropType.Int || this.type === SendPropType.Float || this.type === SendPropType.Vector || this.type === SendPropType.VectorXy) {
      buf.writeFloat32(this.lowValue);
      buf.writeFloat32(this.highValue);
      buf.writeBits(this.numBits, 7);
    } else if (this.type === SendPropType.Array) {
      buf.writeBits(this.elements, 10);
    } else {
      throw new Error("Invalid prop type: " + this.type);
    }
  }
};
var ServerClassInfo = class {
  constructor() {
    Object.defineProperty(this, "classId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "className", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataTableName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.classId = buf.readInt16();
    this.className = buf.readASCIIString();
    this.dataTableName = buf.readASCIIString();
  }
  write(buf) {
    buf.writeInt16(this.classId);
    buf.writeASCIIString(this.className);
    buf.writeASCIIString(this.dataTableName);
  }
};

// node_modules/@nekz/sdp/esm/src/types/GameEventManager.js
var GameEventDescriptor = class {
  constructor() {
    Object.defineProperty(this, "eventId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "keys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.eventId = buf.readBits(9);
    this.name = buf.readASCIIString();
    this.keys = /* @__PURE__ */ new Map();
    let type = buf.readBits(3);
    while (type !== 0) {
      this.keys.set(buf.readASCIIString(), type);
      type = buf.readBits(3);
    }
  }
  write(buf) {
    buf.writeBits(this.eventId, 9);
    buf.writeASCIIString(this.name);
    this.keys.forEach((type, key) => {
      buf.writeBits(type, 3);
      buf.writeASCIIString(key);
    });
    buf.writeBits(0, 3);
  }
};
var GameEvent = class {
  constructor(descriptor) {
    Object.defineProperty(this, "descriptor", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataKeys", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.descriptor = descriptor;
    this.dataKeys = /* @__PURE__ */ new Map();
  }
  get(keyName) {
    return this.dataKeys.get(keyName);
  }
  set(keyName, defaultValue) {
    this.dataKeys.set(keyName, defaultValue);
    return defaultValue;
  }
};
var GameEventManager = class {
  constructor(gameEvents) {
    Object.defineProperty(this, "gameEvents", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.gameEvents = gameEvents;
  }
  deserializeEvent(buf) {
    const eventId = buf.readBits(9);
    const descriptor = this.gameEvents.find((descriptor2) => descriptor2.eventId === eventId);
    if (!descriptor) {
      throw new Error(`Unknown event id ${eventId}!`);
    }
    const event = new GameEvent(descriptor);
    for (const [keyName, type] of descriptor.keys.entries()) {
      switch (type) {
        case 0:
          break;
        case 1:
          event.set(keyName, buf.readASCIIString());
          break;
        case 2:
          event.set(keyName, buf.readFloat32());
          break;
        case 3:
          event.set(keyName, buf.readInt32());
          break;
        case 4:
          event.set(keyName, buf.readInt16());
          break;
        case 5:
          event.set(keyName, buf.readInt8());
          break;
        case 6:
          event.set(keyName, buf.readBoolean());
          break;
        default:
          throw new Error(`Unknown type ${type} for key ${keyName}!`);
      }
    }
    return event;
  }
  serializeEvent(event, buf) {
    buf.writeBits(event.descriptor.eventId, 9);
    for (const [keyName, type] of event.descriptor.keys.entries()) {
      switch (type) {
        case 0:
          break;
        case 1:
          buf.writeASCIIString(event.get(keyName));
          break;
        case 2:
          buf.writeFloat32(event.get(keyName));
          break;
        case 3:
          buf.writeInt32(event.get(keyName));
          break;
        case 4:
          buf.writeInt16(event.get(keyName));
          break;
        case 5:
          buf.writeInt8(event.get(keyName));
          break;
        case 6:
          buf.writeBoolean(event.get(keyName));
          break;
        default:
          throw new Error(`Unknown type ${type} for key ${keyName}!`);
      }
    }
    return event;
  }
};

// node_modules/@nekz/sdp/esm/src/types/NetMessages.js
var NetMessages_exports = {};
__export(NetMessages_exports, {
  NetDisconnect: () => NetDisconnect,
  NetFile: () => NetFile,
  NetMessage: () => NetMessage,
  NetMessages: () => NetMessages,
  NetNop: () => NetNop,
  NetSetConVar: () => NetSetConVar,
  NetSignonState: () => NetSignonState,
  NetSplitScreenUser: () => NetSplitScreenUser,
  NetStringCmd: () => NetStringCmd,
  NetTick: () => NetTick,
  SvcBspDecal: () => SvcBspDecal,
  SvcClassInfo: () => SvcClassInfo,
  SvcCmdKeyValues: () => SvcCmdKeyValues,
  SvcCreateStringTable: () => SvcCreateStringTable,
  SvcCrosshairAngle: () => SvcCrosshairAngle,
  SvcEntityMessage: () => SvcEntityMessage,
  SvcFixAngle: () => SvcFixAngle,
  SvcGameEvent: () => SvcGameEvent,
  SvcGameEventList: () => SvcGameEventList,
  SvcGetCvarValue: () => SvcGetCvarValue,
  SvcMenu: () => SvcMenu,
  SvcPacketEntities: () => SvcPacketEntities,
  SvcPaintMapData: () => SvcPaintMapData,
  SvcPrefetch: () => SvcPrefetch,
  SvcPrint: () => SvcPrint,
  SvcSendTable: () => SvcSendTable,
  SvcServerInfo: () => SvcServerInfo,
  SvcSetPause: () => SvcSetPause,
  SvcSetView: () => SvcSetView,
  SvcSounds: () => SvcSounds,
  SvcSplitScreen: () => SvcSplitScreen,
  SvcTempEntities: () => SvcTempEntities,
  SvcUpdateStringTable: () => SvcUpdateStringTable,
  SvcUserMessage: () => SvcUserMessage,
  SvcVoiceData: () => SvcVoiceData,
  SvcVoiceInit: () => SvcVoiceInit
});

// node_modules/@nekz/sdp/esm/src/types/SoundInfo.js
var SoundFlags = {
  NoFlags: 0,
  ChangeVol: 1 << 0,
  ChangePitch: 1 << 1,
  Stop: 1 << 2,
  Spawning: 1 << 3,
  Delay: 1 << 4,
  StopLooping: 1 << 5,
  Speaker: 1 << 6,
  ShouldPause: 1 << 7,
  IgnorePhonemes: 1 << 8,
  IgnoreName: 1 << 9
};
var SoundInfo = class {
  constructor() {
    Object.defineProperty(this, "readEntityIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "readEntityIndexShort", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entityIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "soundNum", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "flags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "channel", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isAmbient", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isSentence", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sequenceNumber", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "volume", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "soundLevel", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "pitch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "delay", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "origin", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "speakerEntity", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.readEntityIndex = buf.readBoolean();
    if (this.readEntityIndex) {
      this.readEntityIndexShort = buf.readBoolean();
      this.entityIndex = this.readEntityIndexShort ? buf.readBits(5) : buf.readBits(11);
    }
    this.soundNum = buf.readBoolean() ? buf.readBits(13) : 0;
    this.flags = buf.readBoolean() ? buf.readBits(9) : 0;
    this.channel = buf.readBoolean() ? buf.readBits(3) : 0;
    this.isAmbient = buf.readBoolean();
    this.isSentence = buf.readBoolean();
    if (this.flags !== SoundFlags.Stop) {
      if (buf.readBoolean()) {
        this.sequenceNumber = 0;
      } else if (buf.readBoolean()) {
        this.sequenceNumber = 1;
      } else {
        this.sequenceNumber = buf.readBits(10);
      }
      this.volume = buf.readBoolean() ? buf.readBits(7) / 127 : 0;
      this.soundLevel = buf.readBoolean() ? buf.readBits(9) : 0;
      this.pitch = buf.readBoolean() ? buf.readBits(8) : 0;
      if (buf.readBoolean()) {
        this.delay = buf.readBits(13) / 1e3;
        if (this.delay < 0) {
          this.delay *= 10;
        }
        this.delay -= 0.1;
      } else {
        this.delay = 0;
      }
      this.origin = {
        x: buf.readBoolean() ? buf.readBits(12) * 8 : 0,
        y: buf.readBoolean() ? buf.readBits(12) * 8 : 0,
        z: buf.readBoolean() ? buf.readBits(12) * 8 : 0
      };
      this.speakerEntity = buf.readBoolean() ? buf.readBits(12) : 0;
    }
  }
  write(buf) {
    buf.writeBoolean(this.readEntityIndex);
    if (this.readEntityIndex) {
      buf.writeBoolean(this.readEntityIndexShort);
      this.readEntityIndexShort ? buf.writeBits(this.entityIndex, 5) : buf.writeBits(this.entityIndex, 11);
    }
    buf.writeBoolean(this.soundNum !== 0);
    if (this.soundNum !== 0)
      buf.writeBits(this.soundNum, 13);
    buf.writeBoolean(this.flags !== 0);
    if (this.flags !== 0)
      buf.writeBits(this.flags, 9);
    buf.writeBoolean(this.channel !== 0);
    if (this.channel !== 0)
      buf.writeBits(this.channel, 3);
    buf.writeBoolean(this.isAmbient);
    buf.writeBoolean(this.isSentence);
    if (this.flags !== SoundFlags.Stop) {
      buf.writeBoolean(this.sequenceNumber === 0);
      if (this.sequenceNumber !== 0) {
        buf.writeBoolean(this.sequenceNumber === 1);
        if (this.sequenceNumber !== 1) {
          buf.writeBits(this.sequenceNumber, 10);
        }
      }
      buf.writeBoolean(this.volume !== 0);
      if (this.volume !== 0)
        buf.writeBits(this.volume * 127, 7);
      buf.writeBoolean(this.soundLevel !== 0);
      if (this.soundLevel !== 0)
        buf.writeBits(this.soundLevel, 9);
      buf.writeBoolean(this.pitch !== 0);
      if (this.pitch !== 0)
        buf.writeBits(this.pitch, 8);
      buf.writeBoolean(this.delay !== 0);
      if (this.delay !== 0) {
        this.delay += 0.1;
        if (this.delay < 0) {
          this.delay /= 10;
        }
        buf.writeBits(this.delay * 1e3, 13);
      }
      buf.writeBoolean(this.origin.x !== 0);
      if (this.origin.x !== 0) {
        buf.writeBits(this.origin.x * 8, 12);
      }
      buf.writeBoolean(this.origin.y !== 0);
      if (this.origin.y !== 0) {
        buf.writeBits(this.origin.y * 8, 12);
      }
      buf.writeBoolean(this.origin.z !== 0);
      if (this.origin.z !== 0) {
        buf.writeBits(this.origin.z * 8, 12);
      }
      buf.writeBoolean(this.speakerEntity !== 0);
      if (this.speakerEntity !== 0) {
        buf.writeBits(this.speakerEntity, 12);
      }
    }
  }
};

// node_modules/@nekz/sdp/esm/src/lib/bit-buffer.js
var BitView = class {
  constructor(source, byteOffset, byteLength) {
    Object.defineProperty(this, "_view", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "bigEndian", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_scratch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new DataView(new ArrayBuffer(8))
    });
    const isBuffer = source instanceof ArrayBuffer;
    if (!isBuffer) {
      throw new Error("Must specify a valid ArrayBuffer or Buffer.");
    }
    byteOffset = byteOffset || 0;
    byteLength = byteLength || source.byteLength;
    this._view = new Uint8Array(source, byteOffset, byteLength);
    this.bigEndian = false;
  }
  get buffer() {
    return this._view.buffer;
  }
  get byteLength() {
    return this._view.length;
  }
  _setBit(offset, on) {
    if (on) {
      this._view[offset >> 3] |= 1 << (offset & 7);
    } else {
      this._view[offset >> 3] &= ~(1 << (offset & 7));
    }
  }
  getBits(offset, bits, signed) {
    const available = this._view.length * 8 - offset;
    if (bits > available) {
      throw new Error(`Cannot get ${bits} bit(s) from offset ${offset}, ${available} available`);
    }
    let value = 0;
    for (let i = 0; i < bits; ) {
      const remaining = bits - i;
      const bitOffset = offset & 7;
      const currentByte = this._view[offset >> 3];
      const read = Math.min(remaining, 8 - bitOffset);
      if (this.bigEndian) {
        const mask = ~(255 << read);
        const readBits = currentByte >> 8 - read - bitOffset & mask;
        value <<= read;
        value |= readBits;
      } else {
        const mask = ~(255 << read);
        const readBits = currentByte >> bitOffset & mask;
        value |= readBits << i;
      }
      offset += read;
      i += read;
    }
    if (signed) {
      if (bits !== 32 && value & 1 << bits - 1) {
        value |= -1 ^ (1 << bits) - 1;
      }
      return value;
    }
    return value >>> 0;
  }
  setBits(offset, value, bits) {
    const available = this._view.length * 8 - offset;
    if (bits > available) {
      throw new Error(`Cannot set ${bits} bit(s) from offset ${offset}, ${available} available`);
    }
    for (let i = 0; i < bits; ) {
      const remaining = bits - i;
      const bitOffset = offset & 7;
      const byteOffset = offset >> 3;
      const wrote = Math.min(remaining, 8 - bitOffset);
      if (this.bigEndian) {
        const mask = ~(~0 << wrote);
        const writeBits = value >> bits - i - wrote & mask;
        const destShift = 8 - bitOffset - wrote;
        const destMask = ~(mask << destShift);
        this._view[byteOffset] = this._view[byteOffset] & destMask | writeBits << destShift;
      } else {
        const mask = ~(255 << wrote);
        const writeBits = value & mask;
        value >>= wrote;
        const destMask = ~(mask << bitOffset);
        this._view[byteOffset] = this._view[byteOffset] & destMask | writeBits << bitOffset;
      }
      offset += wrote;
      i += wrote;
    }
  }
  getBoolean(offset) {
    return this.getBits(offset, 1, false) !== 0;
  }
  getInt8(offset) {
    return this.getBits(offset, 8, true);
  }
  getUint8(offset) {
    return this.getBits(offset, 8, false);
  }
  getInt16(offset) {
    return this.getBits(offset, 16, true);
  }
  getUint16(offset) {
    return this.getBits(offset, 16, false);
  }
  getInt32(offset) {
    return this.getBits(offset, 32, true);
  }
  getUint32(offset) {
    return this.getBits(offset, 32, false);
  }
  getFloat32(offset) {
    this._scratch.setUint32(0, this.getUint32(offset));
    return this._scratch.getFloat32(0);
  }
  getFloat64(offset) {
    this._scratch.setUint32(0, this.getUint32(offset));
    this._scratch.setUint32(4, this.getUint32(offset + 32));
    return this._scratch.getFloat64(0);
  }
  setBoolean(offset, value) {
    this.setBits(offset, value ? 1 : 0, 1);
  }
  setInt8(offset, value) {
    this.setBits(offset, value, 8);
  }
  setUint8(offset, value) {
    this.setBits(offset, value, 8);
  }
  setInt16(offset, value) {
    this.setBits(offset, value, 16);
  }
  setUint16(offset, value) {
    this.setBits(offset, value, 16);
  }
  setInt32(offset, value) {
    this.setBits(offset, value, 32);
  }
  setUint32(offset, value) {
    this.setBits(offset, value, 32);
  }
  setFloat32(offset, value) {
    this._scratch.setFloat32(0, value);
    this.setBits(offset, this._scratch.getUint32(0), 32);
  }
  setFloat64(offset, value) {
    this._scratch.setFloat64(0, value);
    this.setBits(offset, this._scratch.getUint32(0), 32);
    this.setBits(offset + 32, this._scratch.getUint32(4), 32);
  }
  getArrayBuffer(offset, byteLength) {
    const buffer = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; ++i) {
      buffer[i] = this.getUint8(offset + i * 8);
    }
    return buffer;
  }
};
var stringToByteArray = (str) => {
  const b = [];
  for (let i = 0; i < str.length; ++i) {
    const unicode = str.charCodeAt(i);
    if (unicode <= 127) {
      b.push(unicode);
    } else if (unicode <= 2047) {
      b.push(unicode >> 6 | 192);
      b.push(unicode & 63 | 128);
    } else if (unicode <= 65535) {
      b.push(unicode >> 12 | 224);
      b.push(unicode >> 6 & 63 | 128);
      b.push(unicode & 63 | 128);
    } else {
      b.push(unicode >> 18 | 240);
      b.push(unicode >> 12 & 63 | 128);
      b.push(unicode >> 6 & 63 | 128);
      b.push(unicode & 63 | 128);
    }
  }
  return b;
};
var BitStream = class _BitStream {
  constructor(source, byteOffset, byteLength) {
    Object.defineProperty(this, "_view", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_index", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_startIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_length", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "readBoolean", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getBoolean", 1)
    });
    Object.defineProperty(this, "readInt8", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getInt8", 8)
    });
    Object.defineProperty(this, "readUint8", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getUint8", 8)
    });
    Object.defineProperty(this, "readInt16", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getInt16", 16)
    });
    Object.defineProperty(this, "readUint16", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getUint16", 16)
    });
    Object.defineProperty(this, "readInt32", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getInt32", 32)
    });
    Object.defineProperty(this, "readUint32", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getUint32", 32)
    });
    Object.defineProperty(this, "readFloat32", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getFloat32", 32)
    });
    Object.defineProperty(this, "readFloat64", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.reader("getFloat64", 64)
    });
    Object.defineProperty(this, "writeBoolean", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setBoolean", 1)
    });
    Object.defineProperty(this, "writeInt8", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setInt8", 8)
    });
    Object.defineProperty(this, "writeUint8", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setUint8", 8)
    });
    Object.defineProperty(this, "writeInt16", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setInt16", 16)
    });
    Object.defineProperty(this, "writeUint16", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setUint16", 16)
    });
    Object.defineProperty(this, "writeInt32", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setInt32", 32)
    });
    Object.defineProperty(this, "writeUint32", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setUint32", 32)
    });
    Object.defineProperty(this, "writeFloat32", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setFloat32", 32)
    });
    Object.defineProperty(this, "writeFloat64", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: this.writer("setFloat64", 64)
    });
    const isBuffer = source instanceof ArrayBuffer;
    if (!(source instanceof BitView) && !isBuffer) {
      throw new Error("Must specify a valid BitView or ArrayBuffer");
    }
    if (isBuffer) {
      this._view = new BitView(source, byteOffset, byteLength);
    } else {
      this._view = source;
    }
    this._index = 0;
    this._startIndex = 0;
    this._length = this._view.byteLength * 8;
  }
  get offset() {
    return this._index;
  }
  get index() {
    return this._index - this._startIndex;
  }
  set index(val) {
    this._index = val + this._startIndex;
  }
  get length() {
    return this._length - this._startIndex;
  }
  set length(val) {
    this._length = val + this._startIndex;
  }
  get bitsLeft() {
    return this._length - this._index;
  }
  // Ceil the returned value, over compensating for the amount of
  // bits written to the stream.
  get byteIndex() {
    return Math.ceil(this._index / 8);
  }
  set byteIndex(val) {
    this._index = val * 8;
  }
  get buffer() {
    return this._view.buffer;
  }
  get view() {
    return this._view;
  }
  get bigEndian() {
    return this._view.bigEndian;
  }
  set bigEndian(val) {
    this._view.bigEndian = val;
  }
  reader(name, size) {
    return () => {
      if (this._index + size > this._length) {
        throw new Error("Trying to read past the end of the stream");
      }
      const val = this._view[name](this._index);
      this._index += size;
      return val;
    };
  }
  writer(name, size) {
    return (value) => {
      this._view[name](this._index, value);
      this._index += size;
    };
  }
  readString(bytes, utf8) {
    if (bytes === 0) {
      return "";
    }
    let i = 0;
    const chars = [];
    let append = true;
    const fixedLength = !!bytes;
    if (!bytes) {
      bytes = Math.floor((this._length - this._index) / 8);
    }
    while (i < bytes) {
      const c = this.readUint8();
      if (c === 0) {
        append = false;
        if (!fixedLength) {
          break;
        }
      }
      if (append) {
        chars.push(c);
      }
      ++i;
    }
    const string = String.fromCharCode.apply(null, chars);
    if (utf8) {
      try {
        return decodeURIComponent(escape(string));
      } catch (_e) {
        return string;
      }
    } else {
      return string;
    }
  }
  readBits(bits, signed) {
    const val = this._view.getBits(this._index, bits, signed);
    this._index += bits;
    return val;
  }
  peakBits(offset, bits, signed) {
    const val = this._view.getBits(offset, bits, signed);
    return val;
  }
  writeBits(value, bits) {
    this._view.setBits(this._index, value, bits);
    this._index += bits;
  }
  readASCIIString(bytes) {
    return this.readString(bytes, false);
  }
  readUTF8String(bytes) {
    return this.readString(bytes, true);
  }
  writeASCIIString(string, bytes) {
    const length = bytes || string.length + 1;
    for (let i = 0; i < length; ++i) {
      this.writeUint8(i < string.length ? string.charCodeAt(i) : 0);
    }
  }
  writeUTF8String(string, bytes) {
    const byteArray = stringToByteArray(string);
    const length = bytes || byteArray.length + 1;
    for (let i = 0; i < length; ++i) {
      this.writeUint8(i < byteArray.length ? byteArray[i] : 0);
    }
  }
  readBitStream(bitLength) {
    const slice = new _BitStream(this._view);
    slice._startIndex = this._index;
    slice._index = this._index;
    slice.length = bitLength;
    this._index += bitLength;
    return slice;
  }
  writeBitStream(stream, length) {
    if (!length) {
      length = stream.bitsLeft;
    }
    let bitsToWrite = 0;
    while (length > 0) {
      bitsToWrite = Math.min(length, 32);
      this.writeBits(stream.readBits(bitsToWrite, false), bitsToWrite);
      length -= bitsToWrite;
    }
  }
  readArrayBuffer(byteLength) {
    const buffer = this._view.getArrayBuffer(this._index, byteLength);
    this._index += byteLength * 8;
    return buffer;
  }
  writeArrayBuffer(buffer, byteLength) {
    this.writeBitStream(new _BitStream(buffer), byteLength * 8);
  }
};

// node_modules/@nekz/sdp/esm/src/types/QAngle.js
var QAngle = class {
  constructor(pitch, yaw, roll) {
    Object.defineProperty(this, "pitch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "yaw", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "roll", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
  }
  *[Symbol.iterator]() {
    yield this.pitch;
    yield this.yaw;
    yield this.roll;
  }
};

// node_modules/@nekz/sdp/esm/src/types/Vector.js
var Vector = class {
  constructor(x, y, z) {
    Object.defineProperty(this, "x", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "y", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "z", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.x = x;
    this.y = y;
    this.z = z;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  length2D() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }
};

// node_modules/@nekz/sdp/esm/src/buffer.js
var SourceDemoBuffer = class _SourceDemoBuffer extends BitStream {
  constructor(source, byteOffset, byteLength) {
    super(source, byteOffset, byteLength);
  }
  static from(buffer) {
    const copy = new _SourceDemoBuffer(buffer.view);
    copy._index = buffer._index;
    copy._startIndex = buffer._startIndex;
    copy._length = buffer._length;
    return copy;
  }
  static allocate(bytes) {
    return new _SourceDemoBuffer(new ArrayBuffer(bytes));
  }
  static allocateBits(bits) {
    if (bits % 8 !== 0) {
      throw new Error("Number of bits to allocate is not aligned!");
    }
    return new _SourceDemoBuffer(new ArrayBuffer(bits / 8));
  }
  clone() {
    return new _SourceDemoBuffer(this.view);
  }
  reset() {
    this._index = this._startIndex;
    return this;
  }
  readVarInt32() {
    let result = 0;
    let count = 0;
    let b;
    do {
      if (count == 5)
        return result;
      b = this.readUint8();
      result |= (b & 127) << 7 * count;
      ++count;
    } while (b & 128);
    return result;
  }
  readVector() {
    return new Vector(this.readFloat32(), this.readFloat32(), this.readFloat32());
  }
  writeVector(vec) {
    this.writeFloat32(vec.x);
    this.writeFloat32(vec.y);
    this.writeFloat32(vec.z);
  }
  readQAngle() {
    return new QAngle(this.readFloat32(), this.readFloat32(), this.readFloat32());
  }
  writeQAngle(ang) {
    this.writeFloat32(ang.pitch);
    this.writeFloat32(ang.yaw);
    this.writeFloat32(ang.roll);
  }
  readCoord() {
    const COORD_INTEGER_BITS = 14;
    const COORD_FRACTIONAL_BITS = 5;
    const COORD_DENOMINATOR = 1 << COORD_FRACTIONAL_BITS;
    const COORD_RESOLUTION = 1 / COORD_DENOMINATOR;
    let value = 0;
    let integer = this.readBits(1);
    let fraction = this.readBits(1);
    if (integer || fraction) {
      const sign = this.readBits(1);
      if (integer) {
        integer = this.readBits(COORD_INTEGER_BITS) + 1;
      }
      if (fraction) {
        fraction = this.readBits(COORD_FRACTIONAL_BITS);
      }
      value = integer + fraction * COORD_RESOLUTION;
      if (sign)
        value = -value;
    }
    return value;
  }
  writeCoord(value) {
    const COORD_INTEGER_BITS = 14;
    const COORD_FRACTIONAL_BITS = 5;
    const COORD_DENOMINATOR = 1 << COORD_FRACTIONAL_BITS;
    const COORD_RESOLUTION = 1 / COORD_DENOMINATOR;
    const sign = value <= -COORD_RESOLUTION ? 1 : 0;
    let integer = Math.floor(Math.abs(value));
    const fraction = Math.abs(Math.floor(value * COORD_DENOMINATOR)) & COORD_DENOMINATOR - 1;
    this.writeBits(integer, 1);
    this.writeBits(fraction, 1);
    if (integer || fraction) {
      this.writeBits(sign, 1);
      if (integer) {
        --integer;
        this.writeBits(integer, COORD_INTEGER_BITS);
      }
      if (fraction) {
        this.writeBits(fraction, COORD_FRACTIONAL_BITS);
      }
    }
  }
  readVectorCoord() {
    const [x, y, z] = [
      this.readBoolean(),
      this.readBoolean(),
      this.readBoolean()
    ];
    return new Vector(x ? this.readCoord() : 0, y ? this.readCoord() : 0, z ? this.readCoord() : 0);
  }
  writeVectorCoord(vec) {
    const COORD_FRACTIONAL_BITS = 5;
    const COORD_DENOMINATOR = 1 << COORD_FRACTIONAL_BITS;
    const COORD_RESOLUTION = 1 / COORD_DENOMINATOR;
    const [x, y, z] = [
      vec.x >= COORD_RESOLUTION || vec.x <= -COORD_RESOLUTION,
      vec.y >= COORD_RESOLUTION || vec.y <= -COORD_RESOLUTION,
      vec.z >= COORD_RESOLUTION || vec.z <= -COORD_RESOLUTION
    ];
    this.writeBoolean(x);
    this.writeBoolean(y);
    this.writeBoolean(z);
    x && this.writeCoord(vec.x);
    y && this.writeCoord(vec.y);
    z && this.writeCoord(vec.z);
  }
  readAngles() {
    const { x, y, z } = this.readVectorCoord();
    return new QAngle(x, y, z);
  }
  writeAngles(angle) {
    return this.writeVectorCoord(new Vector(angle.pitch, angle.yaw, angle.roll));
  }
  readField(bits, fallbackValue = 0) {
    return this.readBoolean() ? this.readBits(bits) : fallbackValue;
  }
  writeField(field, bits, fallbackValue = 0) {
    this.writeBoolean(field !== fallbackValue);
    if (field !== fallbackValue) {
      this.writeBits(field, bits);
    }
  }
  readFieldThen(bits, fallbackValue, callback) {
    return this.readBoolean() ? callback(this.readBits(bits)) : fallbackValue;
  }
  writeFieldThen(field, bits, fallbackValue, callback) {
    this.writeBoolean(field !== fallbackValue);
    if (field !== fallbackValue) {
      this.writeBits(field, bits);
      callback(field);
    }
  }
  readBitStream(bitLength) {
    const slice = new _SourceDemoBuffer(this._view);
    slice._startIndex = this._index;
    slice._index = this._index;
    slice.length = bitLength;
    this._index += bitLength;
    return slice;
  }
  writeBitStream(stream, length) {
    if (!length) {
      length = stream.bitsLeft;
    }
    let bitsToWrite = 0;
    let offset = stream.offset;
    while (length > 0) {
      bitsToWrite = Math.min(length, 32);
      this.writeBits(stream.peakBits(offset, bitsToWrite, false), bitsToWrite);
      offset += bitsToWrite;
      length -= bitsToWrite;
    }
  }
  writeArrayBuffer(buffer, byteLength) {
    this.writeBitStream(new _SourceDemoBuffer(buffer), byteLength * 8);
  }
};

// node_modules/@nekz/sdp/esm/src/types/UserMessages.js
var UserMessage = class {
  constructor(type) {
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.type = type;
  }
  getType() {
    return this.type;
  }
  getName() {
    return this.constructor.name;
  }
  read(_buf, _demo) {
    throw new Error(`read() for ${this.constructor.name} not implemented!`);
  }
  write(_buf, _demo) {
    throw new Error(`write() for ${this.constructor.name} not implemented!`);
  }
  as() {
    return this;
  }
};
var Geiger = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "geigerRange", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.geigerRange = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.geigerRange);
  }
};
var Train = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "pos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.pos = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.pos);
  }
};
var HudText = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "text", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.text = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.text);
  }
};
var SayText = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "text", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "wantsToChat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.client = buf.readUint8();
    this.text = buf.readASCIIString();
    this.wantsToChat = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.client);
    buf.writeASCIIString(this.text);
    buf.writeUint8(this.wantsToChat);
  }
};
var SayText2 = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "text", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "wantsToChat", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "messageText", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "messages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.client = buf.readUint8();
    this.text = buf.readASCIIString();
    this.wantsToChat = buf.readUint8();
    this.messageText = buf.readASCIIString();
    this.messages = [
      buf.readASCIIString(),
      buf.readASCIIString(),
      buf.readASCIIString(),
      buf.readASCIIString()
    ];
  }
  write(buf) {
    buf.writeUint8(this.client);
    buf.writeASCIIString(this.text);
    buf.writeUint8(this.wantsToChat);
    buf.writeASCIIString(this.messageText);
    for (const message of this.messages.values()) {
      buf.writeASCIIString(message);
    }
  }
};
var HudPrint;
(function(HudPrint2) {
  HudPrint2[HudPrint2["Notify"] = 1] = "Notify";
  HudPrint2[HudPrint2["Console"] = 2] = "Console";
  HudPrint2[HudPrint2["Talk"] = 3] = "Talk";
  HudPrint2[HudPrint2["Center"] = 4] = "Center";
})(HudPrint || (HudPrint = {}));
var TextMsg = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "msgDest", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "output", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.msgDest = buf.readUint8();
    this.output = ["", "", "", "", ""];
    for (let i = 0; i < 5; ++i) {
      this.output[i] = buf.readASCIIString();
    }
  }
  write(buf) {
    buf.writeUint8(this.msgDest);
    for (const str of this.output.values() ?? []) {
      buf.writeASCIIString(str);
    }
  }
};
var HudMsg = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "textParms", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "message", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.textParms = {
      channel: buf.readUint8(),
      x: buf.readFloat32(),
      y: buf.readFloat32(),
      r1: buf.readUint8(),
      g1: buf.readUint8(),
      b1: buf.readUint8(),
      a1: buf.readUint8(),
      r2: buf.readUint8(),
      g2: buf.readUint8(),
      b2: buf.readUint8(),
      a2: buf.readUint8(),
      effect: buf.readFloat32(),
      fadeinTime: buf.readFloat32(),
      fadeoutTime: buf.readFloat32(),
      holdTime: buf.readFloat32(),
      fxTime: buf.readFloat32()
    };
    this.message = buf.readASCIIString();
  }
  write(buf) {
    buf.writeUint8(this.textParms.channel);
    buf.writeFloat32(this.textParms.x);
    buf.writeFloat32(this.textParms.y);
    buf.writeUint8(this.textParms.r1);
    buf.writeUint8(this.textParms.g1);
    buf.writeUint8(this.textParms.b1);
    buf.writeUint8(this.textParms.a1);
    buf.writeUint8(this.textParms.r2);
    buf.writeUint8(this.textParms.g2);
    buf.writeUint8(this.textParms.b2);
    buf.writeUint8(this.textParms.a2);
    buf.writeFloat32(this.textParms.effect);
    buf.writeFloat32(this.textParms.fadeinTime);
    buf.writeFloat32(this.textParms.fadeoutTime);
    buf.writeFloat32(this.textParms.holdTime);
    buf.writeFloat32(this.textParms.fxTime);
    buf.writeASCIIString(this.message);
  }
};
var ResetHUD = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "reset", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.reset = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.reset);
  }
};
var GameTitle = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var ItemPickup = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.name = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.name);
  }
};
var ShowMenu = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var ShakeCommand;
(function(ShakeCommand2) {
  ShakeCommand2[ShakeCommand2["Start"] = 0] = "Start";
  ShakeCommand2[ShakeCommand2["Stop"] = 1] = "Stop";
  ShakeCommand2[ShakeCommand2["Amplitude"] = 2] = "Amplitude";
  ShakeCommand2[ShakeCommand2["Frequency"] = 3] = "Frequency";
  ShakeCommand2[ShakeCommand2["StartRumbleOnly"] = 4] = "StartRumbleOnly";
  ShakeCommand2[ShakeCommand2["StartNoRumble"] = 5] = "StartNoRumble";
})(ShakeCommand || (ShakeCommand = {}));
var Shake = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "command", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "amplitude", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "frequency", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "duration", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.command = buf.readUint8();
    this.amplitude = buf.readFloat32();
    this.frequency = buf.readFloat32();
    this.duration = buf.readFloat32();
  }
  write(buf) {
    buf.writeUint8(this.command);
    buf.writeFloat32(this.amplitude);
    buf.writeFloat32(this.frequency);
    buf.writeFloat32(this.duration);
  }
};
var Tilt = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "command", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "easeInOut", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "angle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "duration", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.command = buf.readUint8();
    this.easeInOut = buf.readUint8();
    this.angle = buf.readQAngle();
    this.duration = buf.readFloat32();
    this.time = buf.readFloat32();
  }
  write(buf) {
    buf.writeUint8(this.command);
    buf.writeUint8(this.easeInOut);
    buf.writeQAngle(this.angle);
    buf.writeFloat32(this.duration);
    buf.writeFloat32(this.time);
  }
};
var Fade = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "duration", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "holdTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fadeFlags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fade", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.duration = buf.readUint16();
    this.holdTime = buf.readUint16();
    this.fadeFlags = buf.readUint16();
    this.fade = {
      r: buf.readUint8(),
      g: buf.readUint8(),
      b: buf.readUint8(),
      a: buf.readUint8()
    };
  }
  write(buf) {
    buf.writeUint16(this.duration);
    buf.writeUint16(this.holdTime);
    buf.writeUint16(this.fadeFlags);
    buf.writeUint8(this.fade.r);
    buf.writeUint8(this.fade.g);
    buf.writeUint8(this.fade.b);
    buf.writeUint8(this.fade.a);
  }
};
var VGUIMenu = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "show", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "keyValues", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.name = buf.readASCIIString();
    this.show = buf.readUint8();
    this.size = buf.readUint8();
    this.keyValues = [];
    for (let i = 0; i < this.size; ++i) {
      this.keyValues.push({
        key: buf.readASCIIString(),
        value: buf.readASCIIString()
      });
    }
  }
  write(buf) {
    buf.writeASCIIString(this.name);
    buf.writeUint8(this.show);
    buf.writeUint8(this.size);
    this.keyValues.forEach(({ key, value }) => {
      buf.writeASCIIString(key);
      buf.writeASCIIString(value);
    });
  }
};
var Rumble = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "index", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "flags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.index = buf.readUint8();
    this.data = buf.readUint8();
    this.flags = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.index);
    buf.writeUint8(this.data);
    buf.writeUint8(this.flags);
  }
};
var Battery = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "battery", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.battery = buf.readUint16();
  }
  write(buf) {
    buf.writeUint16(this.battery);
  }
};
var Damage = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var VoiceMask = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "audiblePlayers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serverBannedPlayers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serverModEnabled", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    const VOICE_MAX_PLAYERS_DW = 2;
    this.audiblePlayers = [0, 0];
    this.serverBannedPlayers = [0, 0];
    for (let index = 0; index < VOICE_MAX_PLAYERS_DW; ++index) {
      this.audiblePlayers[index] = buf.readUint32();
      this.serverBannedPlayers[index] = buf.readUint32();
    }
    this.serverModEnabled = buf.readUint8();
  }
  write(buf) {
    const VOICE_MAX_PLAYERS_DW = 2;
    for (let index = 0; index < VOICE_MAX_PLAYERS_DW; ++index) {
      buf.writeUint32(this.audiblePlayers[index]);
      buf.writeUint32(this.serverBannedPlayers[index]);
    }
    buf.writeUint8(this.serverModEnabled);
  }
};
var RequestState = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var CloseCaption = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "hash", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "duration", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fromPlayer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.hash = buf.readUint32();
    this.duration = buf.readBits(15, false);
    this.fromPlayer = buf.readBoolean();
  }
  write(buf) {
    buf.writeUint32(this.hash);
    buf.writeBits(this.duration, 15);
    buf.writeBoolean(this.fromPlayer);
  }
};
var CloseCaptionDirect = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "hash", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "duration", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fromPlayer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.hash = buf.readUint32();
    this.duration = buf.readBits(15, false);
    this.fromPlayer = buf.readBoolean();
  }
  write(buf) {
    buf.writeUint32(this.hash);
    buf.writeBits(this.duration, 15);
    buf.writeBoolean(this.fromPlayer);
  }
};
var HintText = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "hintString", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.hintString = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.hintString);
  }
};
var KeyHintText = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "messages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "message", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.messages = buf.readUint8();
    this.message = buf.readASCIIString();
  }
  write(buf) {
    buf.writeUint8(this.messages);
    buf.writeASCIIString(this.message);
  }
};
var SquadMemberDied = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var AmmoDenied = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "ammo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var CreditsType;
(function(CreditsType2) {
  CreditsType2[CreditsType2["Logo"] = 1] = "Logo";
  CreditsType2[CreditsType2["Intro"] = 2] = "Intro";
  CreditsType2[CreditsType2["Outro"] = 3] = "Outro";
})(CreditsType || (CreditsType = {}));
var CreditsMsg = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "creditsType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.creditsType = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.creditsType);
  }
};
var LogoTimeMsg = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "time", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.time = buf.readFloat32();
  }
  write(buf) {
    buf.writeFloat32(this.time);
  }
};
var AchievementEvent = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "achievementId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var UpdateJalopyRadar = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var CurrentTimescale = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var GameTimescaleInterpolators;
(function(GameTimescaleInterpolators2) {
  GameTimescaleInterpolators2[GameTimescaleInterpolators2["Linear"] = 0] = "Linear";
  GameTimescaleInterpolators2[GameTimescaleInterpolators2["Accel"] = 1] = "Accel";
  GameTimescaleInterpolators2[GameTimescaleInterpolators2["DeAccel"] = 2] = "DeAccel";
  GameTimescaleInterpolators2[GameTimescaleInterpolators2["EaseInOut"] = 3] = "EaseInOut";
})(GameTimescaleInterpolators || (GameTimescaleInterpolators = {}));
var DesiredTimescale = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "desiredTimescale", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "durationRealTimeSeconds", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "interpolationType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "startBlendTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.desiredTimescale = buf.readFloat32();
    this.durationRealTimeSeconds = buf.readFloat32();
    this.interpolationType = buf.readUint8();
    this.startBlendTime = buf.readFloat32();
  }
  write(buf) {
    buf.writeFloat32(this.desiredTimescale);
    buf.writeFloat32(this.durationRealTimeSeconds);
    buf.writeUint8(this.interpolationType);
    buf.writeFloat32(this.startBlendTime);
  }
};
var PortalCreditsType;
(function(PortalCreditsType2) {
  PortalCreditsType2[PortalCreditsType2["Logo"] = 1] = "Logo";
  PortalCreditsType2[PortalCreditsType2["Intro"] = 2] = "Intro";
  PortalCreditsType2[PortalCreditsType2["Outro"] = 3] = "Outro";
  PortalCreditsType2[PortalCreditsType2["OutroPortal"] = 4] = "OutroPortal";
})(PortalCreditsType || (PortalCreditsType = {}));
var CreditsPortalMsg = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "creditsType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.creditsType = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.creditsType);
  }
};
var InventoryFlash = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var IndicatorFlash = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var ControlHelperAnimate = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var TakePhoto = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var Flash = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var HudPingIndicator = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "position", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.position = buf.readVector();
  }
  write(buf) {
    buf.writeVector(this.position);
  }
};
var OpenRadialMenu = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var AddLocator = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "playerIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entityHandle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "displayTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "position", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "normal", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "iconName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var MPMapCompleted = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "branch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "level", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.branch = buf.readUint8();
    this.level = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.branch);
    buf.writeUint8(this.level);
  }
};
var MPMapIncomplete = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "branch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "level", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.branch = buf.readUint8();
    this.level = buf.readUint8();
  }
  write(buf) {
    buf.writeUint8(this.branch);
    buf.writeUint8(this.level);
  }
};
var MPMapCompletedData = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "levelCompletions", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var MPTauntEarned = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "taunt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "awardSilently", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.taunt = buf.readASCIIString();
    this.awardSilently = buf.readBoolean();
  }
  write(buf) {
    buf.writeASCIIString(this.taunt);
    buf.writeBoolean(this.awardSilently);
  }
};
var MPTauntUnlocked = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "taunt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.taunt = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.taunt);
  }
};
var MPTauntLocked = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "taunt", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.taunt = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.taunt);
  }
};
var MPAllTauntsLocked = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var PortalFizzleType;
(function(PortalFizzleType2) {
  PortalFizzleType2[PortalFizzleType2["Success"] = 0] = "Success";
  PortalFizzleType2[PortalFizzleType2["CantFit"] = 1] = "CantFit";
  PortalFizzleType2[PortalFizzleType2["OverlappedLinked"] = 2] = "OverlappedLinked";
  PortalFizzleType2[PortalFizzleType2["BadVolume"] = 3] = "BadVolume";
  PortalFizzleType2[PortalFizzleType2["BadSurface"] = 4] = "BadSurface";
  PortalFizzleType2[PortalFizzleType2["Killed"] = 5] = "Killed";
  PortalFizzleType2[PortalFizzleType2["Cleanser"] = 6] = "Cleanser";
  PortalFizzleType2[PortalFizzleType2["Close"] = 7] = "Close";
  PortalFizzleType2[PortalFizzleType2["NearBlue"] = 8] = "NearBlue";
  PortalFizzleType2[PortalFizzleType2["NearRed"] = 9] = "NearRed";
  PortalFizzleType2[PortalFizzleType2["None"] = 10] = "None";
})(PortalFizzleType || (PortalFizzleType = {}));
var PortalFX_Surface = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "entIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playerEntIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "team", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "portalNum", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "effect", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "vecOrigin", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "angles", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var PaintWorld = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "unk1", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk2", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk3", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk4", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk5", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var PaintEntity = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "unk1", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk2", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk3", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk4", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk5", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var ChangePaintColor = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "unk1", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk2", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var PaintBombExplode = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var RemoveAllPaint = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var PaintAllSurfaces = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var RemovePaint = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var StartSurvey = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "handle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.handle = buf.readUint32();
  }
  write(buf) {
    buf.writeUint32(this.handle);
  }
};
var ApplyHitBoxDamageEffect = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "entityHandle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "effectIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "hits", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(_buf) {
  }
  write(_buf) {
  }
};
var SetMixLayerTriggerFactor = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "layer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "group", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "factor", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.layer = buf.readASCIIString();
    this.group = buf.readASCIIString();
    this.factor = buf.readFloat32();
  }
  write(buf) {
    buf.writeASCIIString(this.layer);
    buf.writeASCIIString(this.group);
    buf.writeFloat32(this.factor);
  }
};
var TransitionFade = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "fade", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.fade = buf.readFloat32();
  }
  write(buf) {
    buf.writeFloat32(this.fade);
  }
};
var ScoreboardTempUpdate = class extends UserMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "portalScore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "timeScore", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.portalScore = buf.readUint32();
    this.timeScore = buf.readUint32();
  }
  write(buf) {
    buf.writeUint32(this.portalScore);
    buf.writeUint32(this.timeScore);
  }
};
var ChallengeModeCheatSession = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var ChallengeModeCloseAllUI = class extends UserMessage {
  read(_buf) {
  }
  write(_buf) {
  }
};
var UserMessages = {
  Portal2Engine: [
    Geiger,
    // 0
    Train,
    // 1
    HudText,
    // 2
    SayText,
    // 3
    SayText2,
    // 4
    TextMsg,
    // 5
    HudMsg,
    // 6
    ResetHUD,
    // 7
    GameTitle,
    // 8
    ItemPickup,
    // 9
    ShowMenu,
    // 10
    Shake,
    // 11
    Tilt,
    // 12
    Fade,
    // 13
    VGUIMenu,
    // 14
    Rumble,
    // 15
    Battery,
    // 16
    Damage,
    // 17
    VoiceMask,
    // 18
    RequestState,
    // 19
    CloseCaption,
    // 20
    CloseCaptionDirect,
    // 21
    HintText,
    // 22
    KeyHintText,
    // 23
    SquadMemberDied,
    // 24
    AmmoDenied,
    // 25
    CreditsMsg,
    // 26
    LogoTimeMsg,
    // 27
    AchievementEvent,
    // 28
    UpdateJalopyRadar,
    // 29
    CurrentTimescale,
    // 30
    DesiredTimescale,
    // 31
    CreditsPortalMsg,
    // 32
    InventoryFlash,
    // 33
    IndicatorFlash,
    // 34
    ControlHelperAnimate,
    // 35
    TakePhoto,
    // 36
    Flash,
    // 37
    HudPingIndicator,
    // 38
    OpenRadialMenu,
    // 39
    AddLocator,
    // 40
    MPMapCompleted,
    // 41
    MPMapIncomplete,
    // 42
    MPMapCompletedData,
    // 43
    MPTauntEarned,
    // 44
    MPTauntUnlocked,
    // 45
    MPTauntLocked,
    // 46
    MPAllTauntsLocked,
    // 47
    PortalFX_Surface,
    // 48
    PaintWorld,
    // 49
    PaintEntity,
    // 50
    ChangePaintColor,
    // 51
    PaintBombExplode,
    // 52
    RemoveAllPaint,
    // 53
    PaintAllSurfaces,
    // 54
    RemovePaint,
    // 55
    StartSurvey,
    // 56
    ApplyHitBoxDamageEffect,
    // 57
    SetMixLayerTriggerFactor,
    // 58
    TransitionFade,
    // 59
    ScoreboardTempUpdate,
    // 60
    ChallengeModeCheatSession,
    // 61
    ChallengeModeCloseAllUI
    // 62
    // not registered:
    //      VoiceSubtitle { client: i8, menu: i8, item: i8 }
    //      StatsCrawlMsg {}
    //      creditsMsg {}
    //      MPVSGameOver { unk: i8 }
    //      MPVSRoundEnd { unk: i8 }
    //      MPVSGameStart { unk: i8 }
  ]
};

// node_modules/@nekz/sdp/esm/src/types/NetMessages.js
var NetMessage = class {
  constructor(type) {
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.type = type;
  }
  getType() {
    return this.type;
  }
  getName() {
    return this.constructor.name;
  }
  read(_buf, _demo) {
    throw new Error(`read() for ${this.constructor.name} not implemented!`);
  }
  write(_buf, _demo) {
    throw new Error(`write() for ${this.constructor.name} not implemented!`);
  }
};
var NetNop = class extends NetMessage {
  read() {
  }
  write() {
  }
};
var NetDisconnect = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "text", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.text = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.text);
  }
};
var NetFile = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "transferId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fileName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fileRequested", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.transferId = buf.readInt32();
    this.fileName = buf.readASCIIString();
    this.fileRequested = buf.readBoolean();
    if (demo.demoProtocol === 4) {
      this.unk = buf.readBoolean();
    }
  }
  write(buf, demo) {
    buf.writeInt32(this.transferId);
    buf.writeASCIIString(this.fileName);
    buf.writeBoolean(this.fileRequested);
    if (demo.demoProtocol === 4) {
      buf.writeBoolean(this.unk);
    }
  }
};
var NetSplitScreenUser = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.unk = buf.readBoolean();
  }
  write(buf) {
    buf.writeBoolean(this.unk);
  }
};
var NetTick = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "tick", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "hostFrameTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "hostFrameTimeStdDeviation", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    const NET_TICK_SCALEUP = 1e5;
    this.tick = buf.readInt32();
    this.hostFrameTime = buf.readInt16() / NET_TICK_SCALEUP;
    this.hostFrameTimeStdDeviation = buf.readInt16() / NET_TICK_SCALEUP;
  }
  write(buf) {
    const NET_TICK_SCALEUP = 1e5;
    buf.writeInt32(this.tick);
    const [hostFrameTime, hostFrameTimeStdDeviation] = new Float32Array([
      this.hostFrameTime * NET_TICK_SCALEUP,
      this.hostFrameTimeStdDeviation * NET_TICK_SCALEUP
    ]);
    buf.writeInt16(hostFrameTime);
    buf.writeInt16(hostFrameTimeStdDeviation);
  }
};
var NetStringCmd = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "command", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.command = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.command);
  }
};
var NetSetConVar = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "convars", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.convars = [];
    let length = buf.readInt8();
    while (length--) {
      this.convars.push({
        name: buf.readASCIIString(),
        value: buf.readASCIIString()
      });
    }
  }
  write(buf) {
    buf.writeInt8(this.convars.length);
    this.convars.forEach(({ name, value }) => {
      buf.writeASCIIString(name);
      buf.writeASCIIString(value);
    });
  }
};
var NetSignonState = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "signonState", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "spawnCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numServerPlayers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playersNetworkIdsCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playersNetworkIds", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mapNameLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mapName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.signonState = buf.readInt8();
    this.spawnCount = buf.readInt32();
    if (demo.isNewEngine()) {
      this.numServerPlayers = buf.readInt32();
      this.playersNetworkIdsCount = buf.readInt32();
      if (this.playersNetworkIdsCount > 0) {
        this.playersNetworkIds = buf.readArrayBuffer(this.playersNetworkIdsCount);
      }
      this.mapNameLength = buf.readInt32();
      if (this.mapNameLength > 0) {
        this.mapName = buf.readASCIIString(this.mapNameLength);
      }
    }
  }
  write(buf, demo) {
    buf.writeInt8(this.signonState);
    buf.writeInt32(this.spawnCount);
    if (demo.isNewEngine()) {
      buf.writeInt32(this.numServerPlayers);
      buf.writeInt32(this.playersNetworkIdsCount);
      if (this.playersNetworkIdsCount > 0) {
        buf.writeArrayBuffer(this.playersNetworkIds, this.playersNetworkIdsCount);
      }
      buf.writeInt32(this.mapNameLength);
      if (this.mapNameLength > 0) {
        buf.writeASCIIString(this.mapName, this.mapNameLength);
      }
    }
  }
};
var SvcServerInfo = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "protocol", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serverCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isHltv", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isDedicated", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "clientCrc", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "maxClasses", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mapCrc", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playerSlot", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "maxClients", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tickInterval", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cOs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "gameDir", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mapName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "skyName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "hostName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.protocol = buf.readInt16();
    this.serverCount = buf.readInt32();
    this.isHltv = buf.readBoolean();
    this.isDedicated = buf.readBoolean();
    this.clientCrc = buf.readInt32();
    this.maxClasses = buf.readInt16();
    this.mapCrc = buf.readInt32();
    this.playerSlot = buf.readInt8();
    this.maxClients = buf.readInt8();
    if (demo.isNewEngine()) {
      this.unk = buf.readInt32();
    } else if (demo.networkProtocol === 24) {
      this.unk = buf.readBits(96);
    }
    this.tickInterval = buf.readFloat32();
    this.cOs = String.fromCharCode(buf.readInt8());
    this.gameDir = buf.readASCIIString();
    this.mapName = buf.readASCIIString();
    this.skyName = buf.readASCIIString();
    this.hostName = buf.readASCIIString();
  }
  write(buf, demo) {
    buf.writeInt16(this.protocol);
    buf.writeInt32(this.serverCount);
    buf.writeBoolean(this.isHltv);
    buf.writeBoolean(this.isDedicated);
    buf.writeInt32(this.clientCrc);
    buf.writeInt16(this.maxClasses);
    buf.writeInt32(this.mapCrc);
    buf.writeInt8(this.playerSlot);
    buf.writeInt8(this.maxClients);
    if (demo.isNewEngine()) {
      buf.writeInt32(this.unk);
    } else if (demo.networkProtocol === 24) {
      buf.writeBits(this.unk, 96);
    }
    buf.writeFloat32(this.tickInterval);
    buf.writeInt8(this.cOs.charCodeAt(0));
    buf.writeASCIIString(this.gameDir);
    buf.writeASCIIString(this.mapName);
    buf.writeASCIIString(this.skyName);
    buf.writeASCIIString(this.hostName);
  }
};
var SvcSendTable = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "needsDecoder", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "propsLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "props", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.needsDecoder = buf.readBoolean();
    this.propsLength = buf.readInt16();
    this.props = buf.readBits(this.propsLength);
  }
  write(buf) {
    buf.writeBoolean(this.needsDecoder);
    buf.writeInt16(this.propsLength);
    buf.writeBits(this.props, this.propsLength);
  }
};
var SvcClassInfo = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "length", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "createOnClient", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serverClasses", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.length = buf.readInt16();
    this.createOnClient = buf.readBoolean();
    if (!this.createOnClient) {
      this.serverClasses = [];
      let count = this.length;
      while (count--) {
        this.serverClasses.push({
          classId: buf.readBits(Math.log2(count) + 1),
          className: buf.readASCIIString(),
          dataTableName: buf.readASCIIString()
        });
      }
    }
  }
  write(buf) {
    buf.writeInt16(this.length);
    buf.writeBoolean(this.createOnClient);
    if (!this.createOnClient) {
      let count = this.length;
      this.serverClasses.forEach(({ classId, className, dataTableName }) => {
        --count;
        buf.writeBits(classId, Math.log2(count) + 1);
        buf.writeASCIIString(className);
        buf.writeASCIIString(dataTableName);
      });
    }
  }
};
var SvcSetPause = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "paused", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.paused = buf.readBoolean();
  }
  write(buf) {
    buf.writeBoolean(this.paused);
  }
};
var SvcCreateStringTable = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "maxEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "userDataFixedSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "userDataSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "userDataSizeBits", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "flags", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stringDataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stringData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.name = buf.readASCIIString();
    this.maxEntries = buf.readInt16();
    this.numEntries = buf.readBits(Math.log2(this.maxEntries) + 1);
    this.stringDataLength = buf.readBits(20);
    this.userDataFixedSize = buf.readBoolean();
    this.userDataSize = this.userDataFixedSize ? buf.readBits(12) : 0;
    this.userDataSizeBits = this.userDataFixedSize ? buf.readBits(4) : 0;
    this.flags = buf.readBits(demo.isNewEngine() ? 2 : 1);
    this.stringData = buf.readBitStream(this.stringDataLength);
  }
  write(buf, demo) {
    buf.writeASCIIString(this.name);
    buf.writeInt16(this.maxEntries);
    buf.writeBits(this.numEntries, Math.log2(this.maxEntries) + 1);
    buf.writeBits(this.stringDataLength, 20);
    buf.writeBoolean(this.userDataFixedSize);
    this.userDataFixedSize && buf.writeBits(this.userDataSize, 12);
    this.userDataFixedSize && buf.writeBits(this.userDataSizeBits, 4);
    buf.writeBits(this.flags, demo.isNewEngine() ? 2 : 1);
    buf.writeBitStream(this.stringData, this.stringDataLength);
  }
};
var SvcUpdateStringTable = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "tableId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "numChangedEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stringDataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stringData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.tableId = buf.readBits(5);
    this.numChangedEntries = buf.readBoolean() ? buf.readInt16() : 1;
    this.stringDataLength = buf.readBits(20);
    this.stringData = buf.readBitStream(this.stringDataLength);
  }
  write(buf) {
    buf.writeBits(this.tableId, 5);
    buf.writeBoolean(this.numChangedEntries !== 1);
    this.numChangedEntries !== 1 && buf.writeInt16(this.numChangedEntries);
    buf.writeBits(this.stringDataLength, 20);
    buf.writeBitStream(this.stringData, this.stringDataLength);
  }
};
var SvcVoiceInit = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "codec", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "quality", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.codec = buf.readASCIIString();
    this.quality = buf.readInt8();
    if (this.quality === 255)
      this.unk = buf.readFloat32();
  }
  write(buf) {
    buf.writeASCIIString(this.codec);
    buf.writeInt8(this.quality);
    this.unk !== void 0 && buf.writeFloat32(this.unk);
  }
};
var SvcVoiceData = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "client", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "proximity", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "voiceDataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "voiceData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.client = buf.readInt8();
    this.proximity = buf.readInt8();
    this.voiceDataLength = buf.readInt16();
    this.voiceData = buf.readBitStream(this.voiceDataLength);
  }
  write(buf) {
    buf.writeInt8(this.client);
    buf.writeInt8(this.proximity);
    buf.writeInt16(this.voiceDataLength);
    buf.writeBitStream(this.voiceData, this.voiceDataLength);
  }
};
var SvcPrint = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "message", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.message = buf.readASCIIString();
  }
  write(buf) {
    buf.writeASCIIString(this.message);
  }
};
var SvcSounds = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "reliableSound", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "soundsLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "soundsDataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "soundsData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sounds", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.reliableSound = buf.readBoolean();
    this.soundsLength = this.reliableSound ? 1 : buf.readBits(8);
    this.soundsDataLength = this.reliableSound ? buf.readBits(8) : buf.readBits(16);
    this.soundsData = buf.readBitStream(this.soundsDataLength);
    this.sounds = [];
    if (demo.demoProtocol === 3) {
      let sounds = this.soundsLength;
      while (sounds--) {
        const sound = new SoundInfo();
        sound.read(this.soundsData);
        this.sounds.push(sound);
      }
    }
  }
  write(buf, demo) {
    buf.writeBoolean(this.reliableSound);
    !this.reliableSound && buf.writeBits(this.soundsLength, 8);
    if (demo.demoProtocol === 3) {
      const data = SourceDemoBuffer.allocateBits(this.soundsData.length);
      this.sounds.forEach((sound) => sound.write(data));
      this.soundsData = data.clone();
    }
    buf.writeBits(this.soundsDataLength, this.reliableSound ? 8 : 16);
    buf.writeBitStream(this.soundsData, this.soundsDataLength);
  }
};
var SvcSetView = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "entityIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.entityIndex = buf.readBits(11);
  }
  write(buf) {
    buf.writeBits(this.entityIndex, 11);
  }
};
var SvcFixAngle = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "relative", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "angle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.relative = buf.readBoolean();
    this.angle = [buf.readInt16(), buf.readInt16(), buf.readInt16()];
  }
  write(buf) {
    buf.writeBoolean(this.relative);
    this.angle.forEach((ang) => buf.writeInt16(ang));
  }
};
var SvcCrosshairAngle = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "angle", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.angle = [buf.readInt16(), buf.readInt16(), buf.readInt16()];
  }
  write(buf) {
    this.angle.forEach((ang) => buf.writeInt16(ang));
  }
};
var SvcBspDecal = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "pos", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "decalTextureIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entityIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "modelIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "lowPriority", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.pos = buf.readVectorCoord();
    this.decalTextureIndex = buf.readBits(9);
    if (buf.readBoolean()) {
      this.entityIndex = buf.readBits(11);
      this.modelIndex = buf.readBits(11);
    }
    this.lowPriority = buf.readBoolean();
  }
  write(buf) {
    buf.writeVectorCoord(this.pos);
    buf.writeBits(this.decalTextureIndex, 9);
    buf.writeBoolean(this.entityIndex !== void 0);
    if (this.entityIndex !== void 0) {
      buf.writeBits(this.entityIndex, 11);
      buf.writeBits(this.modelIndex, 11);
    }
    buf.writeBoolean(this.lowPriority);
  }
};
var SvcSplitScreen = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.unk = buf.readBits(1);
    this.dataLength = buf.readBits(11);
    this.data = buf.readBitStream(this.dataLength);
  }
  write(buf) {
    buf.writeBits(this.unk, 1);
    buf.writeBits(this.dataLength, 11);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var SvcUserMessage = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "msgType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "msgDataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "msgData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "userMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.msgType = buf.readInt8();
    this.msgDataLength = buf.readBits(demo.isNewEngine() ? 12 : 11);
    this.msgData = buf.readBitStream(this.msgDataLength);
    if (demo.isPortal2Engine) {
      const userMessageType = UserMessages.Portal2Engine[this.msgType];
      if (userMessageType) {
        this.userMessage = new userMessageType(this.msgType);
        this.userMessage.read(this.msgData, demo);
      }
    }
  }
  write(buf, demo) {
    buf.writeInt8(this.msgType);
    if (this.userMessage) {
      const data = SourceDemoBuffer.from(this.msgData);
      this.userMessage.write(data, demo);
      this.msgData = data.reset();
    }
    buf.writeBits(this.msgDataLength, demo.isNewEngine() ? 12 : 11);
    buf.writeBitStream(this.msgData, this.msgDataLength);
  }
};
var SvcEntityMessage = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "entityIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "classId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.entityIndex = buf.readBits(11);
    this.classId = buf.readBits(9);
    this.dataLength = buf.readBits(11);
    this.data = buf.readBitStream(this.dataLength);
  }
  write(buf) {
    buf.writeBits(this.entityIndex, 11);
    buf.writeBits(this.classId, 9);
    buf.writeBits(this.dataLength, 11);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var SvcGameEvent = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "event", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.data = buf.readBitStream(buf.readBits(11));
    if (demo.gameEventManager) {
      const data = SourceDemoBuffer.from(this.data);
      this.event = demo.gameEventManager.deserializeEvent(data);
    }
  }
  write(buf, demo) {
    if (demo.gameEventManager) {
      const data = SourceDemoBuffer.from(this.data);
      demo.gameEventManager.serializeEvent(this.event, data);
      this.data = data.reset();
    }
    buf.writeBits(this.data.length, 11);
    buf.writeBitStream(this.data, this.data.length);
  }
};
var SvcPacketEntities = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "maxEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isDelta", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "deltaFrom", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "baseLine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "updatedEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "updateBaseline", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.maxEntries = buf.readBits(11);
    this.isDelta = buf.readBoolean();
    this.deltaFrom = this.isDelta ? buf.readInt32() : 0;
    this.baseLine = buf.readBoolean();
    this.updatedEntries = buf.readBits(11);
    this.dataLength = buf.readBits(20);
    this.updateBaseline = buf.readBoolean();
    this.data = buf.readBitStream(this.dataLength);
  }
  write(buf) {
    buf.writeBits(this.maxEntries, 11);
    buf.writeBoolean(this.isDelta);
    this.isDelta && buf.writeInt32(this.deltaFrom);
    buf.writeBoolean(this.baseLine);
    buf.writeBits(this.updatedEntries, 11);
    buf.writeBits(this.dataLength, 20);
    buf.writeBoolean(this.updateBaseline);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var SvcTempEntities = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "numEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.numEntries = buf.readInt8();
    this.dataLength = buf.readBits(17);
    this.data = buf.readBitStream(this.dataLength);
  }
  write(buf) {
    buf.writeInt8(this.numEntries);
    buf.writeBits(this.data.length, 17);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var SvcPrefetch = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "soundIndex", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.soundIndex = buf.readBits(13);
  }
  write(buf) {
    buf.writeBits(this.soundIndex, 13);
  }
};
var SvcMenu = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "menuType", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.menuType = buf.readInt16();
    this.dataLength = buf.readInt32();
    this.data = buf.readBitStream(this.dataLength);
  }
  write(buf) {
    buf.writeInt16(this.menuType);
    buf.writeInt32(this.dataLength);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var SvcGameEventList = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "events", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.events = buf.readBits(9);
    this.dataLength = buf.readBits(20);
    this.data = buf.readBitStream(this.dataLength);
    const gameEvents = [];
    let events = this.events;
    while (events--) {
      const descriptor = new GameEventDescriptor();
      descriptor.read(this.data);
      gameEvents.push(descriptor);
    }
    demo.gameEventManager = new GameEventManager(gameEvents);
  }
  write(buf, demo) {
    buf.writeBits(this.events, 9);
    const data = SourceDemoBuffer.allocate(this.dataLength);
    demo.gameEventManager.gameEvents.forEach((descriptor) => descriptor.write(data));
    this.data = data.clone();
    buf.writeBits(this.dataLength, 20);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var SvcGetCvarValue = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "cookie", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cvarName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.cookie = buf.readInt32();
    this.cvarName = buf.readASCIIString();
  }
  write(buf) {
    buf.writeInt32(this.cookie);
    buf.writeASCIIString(this.cvarName);
  }
};
var SvcCmdKeyValues = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "buffer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    const length = buf.readInt32();
    this.buffer = buf.readArrayBuffer(length);
  }
  write(buf) {
    buf.writeInt32(this.buffer.byteLength);
    buf.writeArrayBuffer(this.buffer.buffer, this.buffer.byteLength);
  }
};
var SvcPaintMapData = class extends NetMessage {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "dataLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.dataLength = buf.readInt32();
    this.data = buf.readBitStream(this.dataLength);
  }
  write(buf) {
    buf.writeInt32(this.data.length);
    buf.writeBitStream(this.data, this.dataLength);
  }
};
var NetMessages = {
  Portal2Engine: [
    NetNop,
    // 0
    NetDisconnect,
    // 1
    NetFile,
    // 2
    NetSplitScreenUser,
    // 3
    NetTick,
    // 4
    NetStringCmd,
    // 5
    NetSetConVar,
    // 6
    NetSignonState,
    // 7
    SvcServerInfo,
    // 8
    SvcSendTable,
    // 9
    SvcClassInfo,
    // 10
    SvcSetPause,
    // 11
    SvcCreateStringTable,
    // 12
    SvcUpdateStringTable,
    // 13
    SvcVoiceInit,
    // 14
    SvcVoiceData,
    // 15
    SvcPrint,
    // 16
    SvcSounds,
    // 17
    SvcSetView,
    // 18
    SvcFixAngle,
    // 19
    SvcCrosshairAngle,
    // 20
    SvcBspDecal,
    // 21
    SvcSplitScreen,
    // 22
    SvcUserMessage,
    // 23
    SvcEntityMessage,
    // 24
    SvcGameEvent,
    // 25
    SvcPacketEntities,
    // 26
    SvcTempEntities,
    // 27
    SvcPrefetch,
    // 28
    SvcMenu,
    // 29
    SvcGameEventList,
    // 30
    SvcGetCvarValue,
    // 31
    SvcCmdKeyValues,
    // 32
    SvcPaintMapData
    // 33
  ],
  HalfLife2Engine: [
    NetNop,
    // 0
    NetDisconnect,
    // 1
    NetFile,
    // 2
    NetTick,
    // 3
    NetStringCmd,
    // 4
    NetSetConVar,
    // 5
    NetSignonState,
    // 6
    SvcPrint,
    // 7
    SvcServerInfo,
    // 8
    SvcSendTable,
    // 9
    SvcClassInfo,
    // 10
    SvcSetPause,
    // 11
    SvcCreateStringTable,
    // 12
    SvcUpdateStringTable,
    // 13
    SvcVoiceInit,
    // 14
    SvcVoiceData,
    // 15
    void 0,
    SvcSounds,
    // 17
    SvcSetView,
    // 18
    SvcFixAngle,
    // 19
    SvcCrosshairAngle,
    // 20
    SvcBspDecal,
    // 21
    void 0,
    SvcUserMessage,
    // 23
    SvcEntityMessage,
    // 24
    SvcGameEvent,
    // 25
    SvcPacketEntities,
    // 26
    SvcTempEntities,
    // 27
    SvcPrefetch,
    // 28
    SvcMenu,
    // 29
    SvcGameEventList,
    // 30
    SvcGetCvarValue,
    // 31
    SvcCmdKeyValues
    // 32
  ],
  NetMessage,
  NetNop,
  NetDisconnect,
  NetFile,
  NetSplitScreenUser,
  NetTick,
  NetStringCmd,
  NetSetConVar,
  NetSignonState,
  SvcServerInfo,
  SvcSendTable,
  SvcClassInfo,
  SvcSetPause,
  SvcCreateStringTable,
  SvcUpdateStringTable,
  SvcVoiceInit,
  SvcVoiceData,
  SvcPrint,
  SvcSounds,
  SvcSetView,
  SvcFixAngle,
  SvcCrosshairAngle,
  SvcBspDecal,
  SvcSplitScreen,
  SvcUserMessage,
  SvcEntityMessage,
  SvcGameEvent,
  SvcPacketEntities,
  SvcTempEntities,
  SvcPrefetch,
  SvcMenu,
  SvcGameEventList,
  SvcGetCvarValue,
  SvcCmdKeyValues,
  SvcPaintMapData
};

// node_modules/@nekz/sdp/esm/src/types/StringTables.js
var StringTables_exports = {};
__export(StringTables_exports, {
  PlayerInfo: () => PlayerInfo,
  StringTable: () => StringTable,
  StringTableClass: () => StringTableClass,
  StringTableEntry: () => StringTableEntry,
  StringTableEntryTypes: () => StringTableEntryTypes
});
var StringTable = class {
  constructor() {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "entries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "classes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    this.name = buf.readASCIIString();
    this.entries = [];
    this.classes = [];
    const EntryType = StringTableEntryTypes[this.name];
    let entries = buf.readInt16();
    while (entries--) {
      const entryName = buf.readASCIIString();
      const entry = new StringTableEntry(entryName);
      if (buf.readBoolean()) {
        entry.read(buf, EntryType, demo);
      }
      this.entries.push(entry);
    }
    if (buf.readBoolean()) {
      let entries2 = buf.readInt16();
      while (entries2--) {
        const entryName = buf.readASCIIString();
        const entry = new StringTableClass(entryName);
        if (buf.readBoolean()) {
          entry.read(buf);
        }
        this.classes.push(entry);
      }
    }
  }
  write(buf, demo) {
    buf.writeASCIIString(this.name);
    buf.writeInt16(this.entries.length);
    this.entries.forEach((entry) => {
      buf.writeASCIIString(entry.name);
      buf.writeBoolean(entry.dataBuffer !== void 0);
      if (entry.dataBuffer !== void 0) {
        entry.write(buf, demo);
      }
    });
    buf.writeBoolean(this.classes.length !== 0);
    if (this.classes.length !== 0) {
      buf.writeInt16(this.classes.length);
      this.classes.forEach((entry) => {
        buf.writeASCIIString(entry.name);
        buf.writeBoolean(entry.data !== void 0);
        if (entry.data !== void 0) {
          entry.write(buf);
        }
      });
    }
  }
};
var StringTableEntry = class {
  constructor(name) {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "length", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataBuffer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = name;
  }
  read(buf, type, demo) {
    this.length = buf.readInt16();
    this.dataBuffer = buf.readBitStream(this.length * 8);
    if (type) {
      this.data = new type();
      this.data.read(this.dataBuffer, demo);
    }
  }
  write(buf, demo) {
    buf.writeInt16(this.length);
    if (this.data) {
      const data = SourceDemoBuffer.allocate(this.length);
      this.data.write(data, demo);
      this.dataBuffer = data.clone();
    }
    buf.writeBitStream(this.dataBuffer, this.length * 8);
  }
};
var StringTableClass = class {
  constructor(name) {
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = name;
  }
  read(buf) {
    const length = buf.readInt16();
    this.data = buf.readASCIIString(length);
  }
  write(buf) {
    buf.writeInt16(this.data.length);
    buf.writeASCIIString(this.data);
  }
};
var PlayerInfo = class {
  constructor() {
    Object.defineProperty(this, "version", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "xuid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "userId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "guid", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "friendsId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "friendsName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "fakePlayer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isHltv", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "customFiles", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "filesDownloaded", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf, demo) {
    if (demo.isNewEngine()) {
      this.version = buf.readInt32();
      this.xuid = buf.readInt32();
    }
    this.name = buf.readASCIIString(32);
    this.userId = buf.readInt32();
    this.guid = buf.readASCIIString(32);
    this.friendsId = buf.readInt32();
    this.friendsName = buf.readASCIIString(32);
    this.fakePlayer = buf.readBoolean();
    this.isHltv = buf.readBoolean();
    this.customFiles = [
      buf.readInt32(),
      buf.readInt32(),
      buf.readInt32(),
      buf.readInt32()
    ];
    this.filesDownloaded = buf.readInt32();
  }
  write(buf, demo) {
    if (demo.isNewEngine()) {
      buf.writeInt32(this.version);
      buf.writeInt32(this.xuid);
    }
    buf.writeASCIIString(this.name, 32);
    buf.writeInt32(this.userId);
    buf.writeASCIIString(this.guid, 32);
    buf.writeInt32(this.friendsId);
    buf.writeASCIIString(this.friendsName, 32);
    buf.writeBoolean(this.fakePlayer);
    buf.writeBoolean(this.isHltv);
    buf.writeInt32(this.customFiles.at(0)), buf.writeInt32(this.customFiles.at(1)), buf.writeInt32(this.customFiles.at(2)), buf.writeInt32(this.customFiles.at(3)), buf.writeInt32(this.filesDownloaded);
  }
};
var StringTableEntryTypes = {
  userinfo: PlayerInfo
};

// node_modules/@nekz/sdp/esm/src/types/UserCmd.js
var UserCmd = class {
  constructor() {
    Object.defineProperty(this, "commandNumber", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tickCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewAngleX", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewAngleY", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewAngleZ", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "forwardMove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sideMove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "upMove", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "buttons", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "impulse", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "weaponSelect", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "weaponSubtype", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mouseDx", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mouseDy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    if (buf.readBoolean())
      this.commandNumber = buf.readInt32();
    if (buf.readBoolean())
      this.tickCount = buf.readInt32();
    if (buf.readBoolean())
      this.viewAngleX = buf.readFloat32();
    if (buf.readBoolean())
      this.viewAngleY = buf.readFloat32();
    if (buf.readBoolean())
      this.viewAngleZ = buf.readFloat32();
    if (buf.readBoolean())
      this.forwardMove = buf.readFloat32();
    if (buf.readBoolean())
      this.sideMove = buf.readFloat32();
    if (buf.readBoolean())
      this.upMove = buf.readFloat32();
    if (buf.readBoolean())
      this.buttons = buf.readInt32();
    if (buf.readBoolean())
      this.impulse = buf.readInt8();
    if (buf.readBoolean()) {
      this.weaponSelect = buf.readBits(11);
      if (buf.readBoolean())
        this.weaponSubtype = buf.readBits(6);
    }
    if (buf.readBoolean())
      this.mouseDx = buf.readInt16();
    if (buf.readBoolean())
      this.mouseDy = buf.readInt16();
  }
  write(buf) {
    buf.writeBoolean(this.commandNumber !== void 0);
    if (this.commandNumber !== void 0)
      buf.writeInt32(this.commandNumber);
    buf.writeBoolean(this.tickCount !== void 0);
    if (this.tickCount !== void 0)
      buf.writeInt32(this.tickCount);
    buf.writeBoolean(this.viewAngleX !== void 0);
    if (this.viewAngleX !== void 0)
      buf.writeFloat32(this.viewAngleX);
    buf.writeBoolean(this.viewAngleY !== void 0);
    if (this.viewAngleY !== void 0)
      buf.writeFloat32(this.viewAngleY);
    buf.writeBoolean(this.viewAngleZ !== void 0);
    if (this.viewAngleZ !== void 0)
      buf.writeFloat32(this.viewAngleZ);
    buf.writeBoolean(this.forwardMove !== void 0);
    if (this.forwardMove !== void 0)
      buf.writeFloat32(this.forwardMove);
    buf.writeBoolean(this.sideMove !== void 0);
    if (this.sideMove !== void 0)
      buf.writeFloat32(this.sideMove);
    buf.writeBoolean(this.upMove !== void 0);
    if (this.upMove !== void 0)
      buf.writeFloat32(this.upMove);
    buf.writeBoolean(this.buttons !== void 0);
    if (this.buttons !== void 0)
      buf.writeInt32(this.buttons);
    buf.writeBoolean(this.impulse !== void 0);
    if (this.impulse !== void 0)
      buf.writeInt8(this.impulse);
    buf.writeBoolean(this.weaponSelect !== void 0);
    if (this.weaponSelect !== void 0) {
      buf.writeBits(this.weaponSelect, 11);
      buf.writeBoolean(this.weaponSubtype !== void 0);
      if (this.weaponSubtype !== void 0) {
        buf.writeBits(this.weaponSubtype, 6);
      }
    }
    buf.writeBoolean(this.mouseDx !== void 0);
    if (this.mouseDx !== void 0)
      buf.writeInt16(this.mouseDx);
    buf.writeBoolean(this.mouseDy !== void 0);
    if (this.mouseDy !== void 0)
      buf.writeInt16(this.mouseDy);
  }
};

// node_modules/@nekz/sdp/esm/src/messages.js
var messages_exports = {};
__export(messages_exports, {
  ConsoleCmd: () => ConsoleCmd,
  CustomData: () => CustomData,
  DataTable: () => DataTable,
  DemoMessages: () => DemoMessages,
  Message: () => Message,
  Packet: () => Packet,
  SignOn: () => SignOn,
  Stop: () => Stop,
  StringTable: () => StringTable2,
  SyncTick: () => SyncTick,
  UserCmd: () => UserCmd2
});
var Message = class {
  constructor(type) {
    Object.defineProperty(this, "type", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tick", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "slot", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.type = type;
  }
  static default(type) {
    return new this(type);
  }
  getType() {
    return this.type;
  }
  getName() {
    return this.constructor.name;
  }
  getTick() {
    return this.tick;
  }
  getSlot() {
    return this.slot;
  }
  setTick(tick) {
    this.tick = tick;
    return this;
  }
  setSlot(slot) {
    this.slot = slot;
    return this;
  }
  read(_buf, _demo) {
    throw new Error(`read() for ${this.constructor.name} not implemented!`);
  }
  write(_buf, _demo) {
    throw new Error(`write() for ${this.constructor.name} not implemented!`);
  }
};
var Packet = class extends Message {
  constructor(type) {
    super(type);
    Object.defineProperty(this, "packets", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cmdInfo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "inSequence", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "outSequence", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "restData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  findPacket(type) {
    const byType = type instanceof NetMessage ? (packet) => packet instanceof type : (packet) => type(packet);
    return (this.packets ?? []).find(byType);
  }
  findPackets(type) {
    const byType = type instanceof NetMessage ? (packet) => packet instanceof type : (packet) => type(packet);
    return (this.packets ?? []).filter(byType);
  }
  read(buf, demo) {
    let mssc = demo.demoProtocol === 4 ? 2 : 1;
    this.cmdInfo = [];
    while (mssc--) {
      const cmd = new CmdInfo();
      cmd.read(buf);
      this.cmdInfo.push(cmd);
    }
    this.inSequence = buf.readInt32();
    this.outSequence = buf.readInt32();
    this.data = buf.readBitStream(buf.readInt32() * 8);
    return this;
  }
  write(buf) {
    this.cmdInfo.forEach((cmd) => cmd.write(buf));
    buf.writeInt32(this.inSequence);
    buf.writeInt32(this.outSequence);
    buf.writeInt32(this.data.length / 8);
    buf.writeBitStream(this.data, this.data.length);
    return this;
  }
  *[Symbol.iterator]() {
    for (const packet of this.packets ?? []) {
      yield packet;
    }
  }
};
var SignOn = class extends Packet {
};
var SyncTick = class extends Message {
  read() {
    return this;
  }
  write() {
    return this;
  }
};
var ConsoleCmd = class extends Message {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "command", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.command = buf.readASCIIString(buf.readInt32());
    return this;
  }
  write(buf) {
    buf.writeInt32(this.command.length + 1);
    buf.writeASCIIString(this.command, this.command.length + 1);
    return this;
  }
};
var UserCmd2 = class extends Message {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "cmd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "userCmd", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "restData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.cmd = buf.readInt32();
    this.data = buf.readBitStream(buf.readInt32() * 8);
    return this;
  }
  write(buf) {
    buf.writeInt32(this.cmd);
    buf.writeInt32(this.data.length / 8);
    buf.writeBitStream(this.data, this.data.length);
    return this;
  }
};
var DataTable = class extends Message {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "dataTable", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.data = buf.readBitStream(buf.readInt32() * 8);
    return this;
  }
  write(buf) {
    buf.writeInt32(this.data.length / 8);
    buf.writeBitStream(this.data, this.data.length);
    return this;
  }
};
var Stop = class extends Message {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "restData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.restData = buf.readBitStream(buf.bitsLeft);
    return this;
  }
  write(buf) {
    buf.writeBitStream(this.restData, this.restData.bitsLeft);
    return this;
  }
};
var CustomData = class extends Message {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "unk", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.unk = buf.readInt32();
    this.data = buf.readBitStream(buf.readInt32() * 8);
    return this;
  }
  write(buf) {
    buf.writeInt32(this.unk);
    buf.writeInt32(this.data.length / 8);
    buf.writeBitStream(this.data, this.data.length);
    return this;
  }
};
var StringTable2 = class extends Message {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stringTables", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "restData", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
  }
  read(buf) {
    this.data = buf.readBitStream(buf.readInt32() * 8);
    return this;
  }
  write(buf) {
    buf.writeInt32(this.data.length / 8);
    buf.writeBitStream(this.data, this.data.length);
    return this;
  }
};
var DemoMessages = {
  NewEngine: [
    void 0,
    SignOn,
    // 1
    Packet,
    // 2
    SyncTick,
    // 3
    ConsoleCmd,
    // 4
    UserCmd2,
    // 5
    DataTable,
    // 6
    Stop,
    // 7
    CustomData,
    // 8
    StringTable2
    // 9
  ],
  OldEngine: [
    void 0,
    SignOn,
    // 1
    Packet,
    // 2
    SyncTick,
    // 3
    ConsoleCmd,
    // 4
    UserCmd2,
    // 5
    DataTable,
    // 6
    Stop,
    // 7
    StringTable2
    // 8
  ],
  Message,
  SignOn,
  Packet,
  SyncTick,
  ConsoleCmd,
  UserCmd: UserCmd2,
  DataTable,
  Stop,
  CustomData,
  StringTable: StringTable2
};

// node_modules/@nekz/sdp/esm/src/speedrun/games/Portal.js
var Portal_default = {
  directory: "portal",
  tickrate: 1 / 0.015,
  rules: [
    {
      map: "testchmb_a_00",
      offset: 1,
      type: "start",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const startPos = { x: -544, y: -368.75, z: 160 };
          return pos.current.x === startPos.x && pos.current.y === startPos.y && pos.current.z === startPos.z;
        }
        return false;
      }
    },
    {
      map: "escape_02",
      offset: 1,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          return cmds.current.includes("startneurotoxins 99999");
        }
        return false;
      }
    }
  ]
};

// node_modules/@nekz/sdp/esm/src/speedrun/games/Portal2.js
var Portal2_default = {
  directory: "portal2",
  tickrate: 60,
  rules: [
    {
      map: "sp_a1_intro1",
      offset: 1,
      type: "start",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const startPos = { x: -8709.2, y: 1690.07, z: 28 };
          const tolerance = { x: 0.02, y: 0.02, z: 0.05 };
          return !(Math.abs(pos.current.x - startPos.x) > tolerance.x) && !(Math.abs(pos.current.y - startPos.y) > tolerance.y) && !(Math.abs(pos.current.z - startPos.z) > tolerance.z);
        }
        return false;
      }
    },
    {
      map: "e1912",
      offset: -2,
      type: "start",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const startPos = {
            x: -655.748779296875,
            y: -918.37353515625,
            z: -4.96875
          };
          return pos.previous.x === startPos.x && pos.previous.y === startPos.y && pos.previous.z === startPos.z && pos.current.x !== startPos.x && pos.current.y !== startPos.y && pos.current.z !== startPos.z;
        }
        return false;
      }
    },
    {
      map: void 0,
      offset: 0,
      type: "start",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          return cmds.current.includes("dsp_player 0") && cmds.current.includes("ss_force_primary_fullscreen 0");
        }
        return false;
      }
    },
    {
      map: "mp_coop_start",
      offset: 0,
      type: "start",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const startPosBlue = { x: -9896, y: -4400, z: 3048 };
          const startPosOrange = { x: -11168, y: -4384, z: 3040.03125 };
          return pos.current.x === startPosBlue.x && pos.current.y === startPosBlue.y && pos.current.z === startPosBlue.z || pos.current.x === startPosOrange.x && pos.current.y === startPosOrange.y && pos.current.z === startPosOrange.z;
        }
        return false;
      }
    },
    {
      map: "sp_a4_finale4",
      offset: -852,
      type: "end",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const endPos = { x: 54.1, y: 159.2, z: -201.4 };
          const a = (pos.current.x - endPos.x) ** 2;
          const b = (pos.current.y - endPos.y) ** 2;
          const c = 50 ** 2;
          return a + b < c && pos.current.z < endPos.z;
        }
        return false;
      }
    },
    {
      map: void 0,
      offset: 0,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          return cmds.current.find((cmd) => cmd.startsWith("playvideo_end_level_transition")) !== void 0;
        }
        return false;
      }
    },
    {
      map: "mp_coop_paint_longjump_intro",
      offset: 0,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          const outro = "playvideo_exitcommand_nointerrupt coop_outro end_movie vault-movie_outro";
          return cmds.current.includes(outro);
        }
        return false;
      }
    },
    {
      map: "mp_coop_paint_crazy_box",
      offset: 0,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          const outro = "playvideo_exitcommand_nointerrupt dlc1_endmovie end_movie movie_outro";
          return cmds.current.includes(outro);
        }
        return false;
      }
    }
  ]
};

// node_modules/@nekz/sdp/esm/src/speedrun/games/PortalStoriesMel.js
var PortalStoriesMel_default = {
  directory: "portal_stories",
  tickrate: 60,
  rules: [
    {
      map: ["sp_a1_tramride", "st_a1_tramride"],
      offset: 0,
      type: "start",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const startPos = {
            x: -4592,
            y: -4475.4052734375,
            z: 108.683975219727
          };
          return pos.previous.x === startPos.x && pos.previous.y === startPos.y && pos.previous.z === startPos.z && pos.current.x !== startPos.x && pos.current.y !== startPos.y && pos.current.z !== startPos.z;
        }
        return false;
      }
    },
    {
      map: ["sp_a4_finale", "st_a4_finale"],
      offset: 0,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          const outro = "playvideo_exitcommand_nointerrupt aegis_interior.bik end_movie movie_aegis_interior";
          return cmds.current.includes(outro);
        }
        return false;
      }
    }
  ]
};

// node_modules/@nekz/sdp/esm/src/speedrun/games/ApertureTag.js
var ApertureTag_default = {
  directory: "aperturetag",
  tickrate: 60,
  rules: [
    {
      map: "gg_intro_wakeup",
      offset: 0,
      type: "start",
      match: ({ pos }) => {
        if (pos !== void 0) {
          const startPos = { x: -723, y: -2481, z: 17 };
          return pos.previous.x === startPos.x && pos.previous.y === startPos.y && pos.previous.z === startPos.z && pos.current.x !== startPos.x && pos.current.y !== startPos.y && pos.current.z !== startPos.z;
        }
        return false;
      }
    },
    {
      map: "gg_stage_theend",
      offset: 0,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          const outro = "playvideo_exitcommand_nointerrupt at_credits end_movie credits_video";
          return cmds.current.includes(outro);
        }
        return false;
      }
    },
    {
      map: void 0,
      offset: 0,
      type: "start",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          return cmds.current.includes("dsp_player 0") && cmds.current.includes("ss_force_primary_fullscreen 0");
        }
        return false;
      }
    },
    {
      map: void 0,
      offset: 0,
      type: "end",
      match: ({ cmds }) => {
        if (cmds !== void 0) {
          return cmds.current.find((cmd) => cmd.startsWith("playvideo_end_level_transition")) !== void 0;
        }
        return false;
      }
    }
  ]
};

// node_modules/@nekz/sdp/esm/src/speedrun/games/mod.js
var SourceGames = [
  Portal_default,
  Portal2_default,
  PortalStoriesMel_default,
  ApertureTag_default
];

// node_modules/@nekz/sdp/esm/src/demo.js
var Portal2EngineGameMods = [
  "portal2",
  "TWTM",
  "aperturetag",
  "portal_stories",
  "portalreloaded",
  "Portal 2 Speedrun Mod"
];
var SourceDemo = class {
  constructor() {
    Object.defineProperty(this, "demoFileStamp", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "demoProtocol", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "networkProtocol", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serverName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "clientName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "mapName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "gameDirectory", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playbackTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playbackTicks", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "playbackFrames", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "signOnLength", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "messages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "game", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "gameEventManager", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isPortal2Engine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
  }
  static default() {
    return new this();
  }
  isNewEngine() {
    return this.demoProtocol === 4;
  }
  findMessage(type) {
    const byType = type.prototype instanceof Message ? (msg) => msg instanceof type : (msg) => type(msg);
    return (this.messages ?? []).find(byType);
  }
  findMessages(type) {
    const byType = type.prototype instanceof Message ? (msg) => msg instanceof type : (msg) => type(msg);
    return (this.messages ?? []).filter(byType);
  }
  findPacket(type) {
    const byType = type.prototype instanceof NetMessage ? (packet) => packet instanceof type : (packet) => type(packet);
    for (const msg of this.messages ?? []) {
      if (msg instanceof Packet) {
        const packet = (msg.packets ?? []).find(byType);
        if (packet) {
          return packet;
        }
      }
    }
  }
  findPackets(type) {
    const isType = type.prototype instanceof NetMessage ? (packet) => packet instanceof type : (packet) => type(packet);
    const packets = [];
    for (const msg of this.messages ?? []) {
      if (msg instanceof Packet) {
        for (const packet of msg.packets ?? []) {
          if (isType(packet)) {
            packets.push(packet);
          }
        }
      }
    }
    return packets;
  }
  readHeader(buf) {
    this.demoFileStamp = buf.readASCIIString(8);
    if (this.demoFileStamp !== "HL2DEMO") {
      throw new Error(`Invalid demo file stamp: ${this.demoFileStamp}`);
    }
    this.demoProtocol = buf.readInt32();
    this.networkProtocol = buf.readInt32();
    this.serverName = buf.readASCIIString(260);
    this.clientName = buf.readASCIIString(260);
    this.mapName = buf.readASCIIString(260);
    this.gameDirectory = buf.readASCIIString(260);
    this.playbackTime = buf.readFloat32();
    this.playbackTicks = buf.readInt32();
    this.playbackFrames = buf.readInt32();
    this.signOnLength = buf.readInt32();
    this.messages = [];
    this.isPortal2Engine = Portal2EngineGameMods.includes(this.gameDirectory);
    return this;
  }
  writeHeader(buf) {
    buf.writeASCIIString(this.demoFileStamp);
    buf.writeInt32(this.demoProtocol);
    buf.writeInt32(this.networkProtocol);
    buf.writeASCIIString(this.serverName, 260);
    buf.writeASCIIString(this.clientName, 260);
    buf.writeASCIIString(this.mapName, 260);
    buf.writeASCIIString(this.gameDirectory, 260);
    buf.writeFloat32(this.playbackTime);
    buf.writeInt32(this.playbackTicks);
    buf.writeInt32(this.playbackFrames);
    buf.writeInt32(this.signOnLength);
    return this;
  }
  readMessages(buf) {
    if (!this.messages) {
      this.messages = [];
    }
    const readSlot = this.isNewEngine();
    const demoMessages = readSlot ? DemoMessages.NewEngine : DemoMessages.OldEngine;
    while (buf.bitsLeft > 8) {
      const type = buf.readInt8();
      const messageType = demoMessages[type];
      if (messageType) {
        const message = messageType.default(type).setTick(buf.readInt32());
        if (readSlot) {
          message.setSlot(buf.readInt8());
        }
        this.messages.push(message.read(buf, this));
      } else {
        throw new Error(`Unknown demo message type: ${type}`);
      }
    }
    return this;
  }
  writeMessages(buf) {
    (this.messages ?? []).forEach((message) => {
      buf.writeInt8(message.type);
      buf.writeInt32(message.tick);
      if (message.slot !== void 0) {
        buf.writeInt8(message.slot);
      }
      message.write(buf, this);
    });
  }
  readUserCmds() {
    for (const message of this.messages ?? []) {
      if (message instanceof DemoMessages.UserCmd) {
        const data = SourceDemoBuffer.from(message.data);
        const cmd = new UserCmd();
        cmd.read(data);
        message.userCmd = cmd;
        if (data.bitsLeft) {
          message.restData = data.readBitStream(data.bitsLeft);
        }
      }
    }
    return this;
  }
  writeUserCmds() {
    for (const message of this.messages ?? []) {
      if (message instanceof DemoMessages.UserCmd && message.userCmd) {
        const data = SourceDemoBuffer.allocateBits(message.data.length);
        message.userCmd.write(data);
        if (message.restData) {
          data.writeBitStream(message.restData, message.restData.bitsLeft);
        }
        message.data = data.clone();
      }
    }
    return this;
  }
  readStringTables() {
    for (const message of this.messages ?? []) {
      if (message instanceof DemoMessages.StringTable) {
        const stringTables = [];
        const data = SourceDemoBuffer.from(message.data);
        let tables = data.readInt8() ?? 0;
        while (tables--) {
          const table = new StringTable();
          table.read(data, this);
          stringTables.push(table);
        }
        if (data.bitsLeft) {
          message.restData = data.readBitStream(data.bitsLeft);
        }
        message.stringTables = stringTables;
      }
    }
    return this;
  }
  writeStringTables() {
    for (const message of this.messages ?? []) {
      if (message instanceof DemoMessages.StringTable && message.stringTables) {
        const data = SourceDemoBuffer.allocateBits(message.data.length);
        data.writeInt8(message.stringTables.length);
        message.stringTables.forEach((stringTable) => {
          stringTable.write(data, this);
        });
        if (message.restData) {
          data.writeBitStream(message.restData, message.restData.bitsLeft);
        }
        message.data = data.clone();
      }
    }
    return this;
  }
  readDataTables() {
    for (const message of this.messages ?? []) {
      if (message instanceof DataTable) {
        const dataTable = {
          tables: [],
          serverClasses: [],
          restData: void 0
        };
        const data = SourceDemoBuffer.from(message.data);
        while (data.readBoolean()) {
          const dt = new SendTable();
          dt.read(data, this);
          dataTable.tables.push(dt);
        }
        let classes = data.readInt16() ?? 0;
        while (classes--) {
          const sc = new ServerClassInfo();
          sc.read(data);
          dataTable.serverClasses.push(sc);
        }
        if (data.bitsLeft) {
          dataTable.restData = data.readBitStream(data.bitsLeft);
        }
        message.dataTable = dataTable;
      }
    }
    return this;
  }
  writeDataTables() {
    for (const message of this.messages ?? []) {
      if (message instanceof DataTable && message.dataTable) {
        const data = SourceDemoBuffer.allocateBits(message.data.length);
        message.dataTable.tables.forEach((dt) => {
          data.writeBoolean(true);
          dt.write(data, this);
        });
        data.writeBoolean(false);
        data.writeInt16(message.dataTable.serverClasses.length);
        message.dataTable.serverClasses.forEach((sc) => {
          sc.write(data);
        });
        if (message.dataTable.restData) {
          data.writeBitStream(message.dataTable.restData, message.dataTable.restData.bitsLeft);
        }
        message.data = data.clone();
      }
    }
    return this;
  }
  readPackets(netMessages) {
    netMessages = netMessages ?? (this.isNewEngine() ? NetMessages.Portal2Engine : NetMessages.HalfLife2Engine);
    for (const message of this.messages ?? []) {
      if (message instanceof Packet) {
        const packets = [];
        const data = SourceDemoBuffer.from(message.data);
        while ((data.bitsLeft ?? 0) > 6) {
          const type = data.readBits(6) ?? -1;
          const NetMessage2 = netMessages.at(type);
          if (NetMessage2) {
            const packet = new NetMessage2(type);
            packet.read(data, this);
            packets.push(packet);
          } else {
            throw new Error(`Net message type ${type} unknown!`);
          }
        }
        if (data.bitsLeft) {
          message.restData = data.readBitStream(data.bitsLeft);
        }
        message.packets = packets;
      }
    }
    return this;
  }
  writePackets() {
    for (const message of this.messages ?? []) {
      if (message instanceof Packet && message.packets) {
        const data = SourceDemoBuffer.allocateBits(message.data.length);
        message.packets.forEach((packet) => {
          data.writeBits(packet.type, 6);
          packet.write(data, this);
        });
        if (message.restData) {
          data.writeBitStream(message.restData, message.restData.bitsLeft);
        }
        message.data = data.clone();
      }
    }
    return this;
  }
  detectGame(sourceGames = SourceGames) {
    this.game = sourceGames.find((game) => game.directory === this.gameDirectory);
    return this;
  }
  getIntervalPerTick() {
    if (this.playbackTicks === void 0 || this.playbackTime === void 0) {
      throw new Error("Cannot find tickrate without parsing the header.");
    }
    if (this.playbackTicks === 0) {
      if (this.game !== void 0) {
        return 1 / this.game.tickrate;
      }
      throw new Error("Cannot find ipt of null tick demo.");
    }
    return this.playbackTime / this.playbackTicks;
  }
  getTickrate() {
    if (this.playbackTicks === void 0 || this.playbackTime === void 0) {
      throw new Error("Cannot find tickrate without parsing the header.");
    }
    if (this.playbackTime === 0) {
      if (this.game !== void 0) {
        return this.game.tickrate;
      }
      throw new Error("Cannot find tickrate of null tick demo.");
    }
    return this.playbackTicks / this.playbackTime;
  }
  adjustTicks() {
    var _a;
    if (!((_a = this.messages) == null ? void 0 : _a.length)) {
      throw new Error("Cannot adjust ticks without parsed messages.");
    }
    let synced = false;
    let last = 0;
    for (const message of this.messages) {
      if (message instanceof SyncTick) {
        synced = true;
      }
      if (!synced) {
        message.tick = 0;
      } else if (message.tick < 0) {
        message.tick = last;
      }
      last = message.tick;
    }
    return this;
  }
  adjustRange(endTick = 0, startTick = 0, tickrate = void 0) {
    var _a;
    if (!((_a = this.messages) == null ? void 0 : _a.length)) {
      throw new Error("Cannot adjust range without parsed messages.");
    }
    if (endTick < 1) {
      const packets = this.findMessages(Packet);
      const lastPacket = packets[packets.length - 1];
      if (!lastPacket) {
        throw new Error("Cannot adjust range without parsed packets.");
      }
      endTick = lastPacket.tick;
    }
    const delta = endTick - startTick;
    if (delta < 0) {
      throw new Error("Start tick is greater than end tick.");
    }
    const ipt = tickrate === void 0 ? this.getIntervalPerTick() : 1 / tickrate;
    this.playbackTicks = delta;
    this.playbackTime = ipt * delta;
    return this;
  }
  rebaseFrom(tick) {
    var _a;
    if (!((_a = this.messages) == null ? void 0 : _a.length)) {
      throw new Error("Cannot adjust ticks without parsed messages.");
    }
    let synced = false;
    let last = 0;
    for (const message of this.messages) {
      if (message.tick === tick) {
        synced = true;
      }
      if (!synced) {
        message.tick = 0;
      } else if (message.tick < 0) {
        message.tick = last;
      } else {
        message.tick -= tick;
      }
      last = message.tick;
    }
    return this;
  }
  getSyncedTicks(demo, viewTolerance = 1, splitScreenIndex = 0) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m;
    if (!((_a = this.messages) == null ? void 0 : _a.length) || !((_b = demo.messages) == null ? void 0 : _b.length)) {
      throw new Error("Cannot adjust ticks without parsed messages.");
    }
    const syncedTicks = [];
    for (const message of this.messages) {
      if (message instanceof Packet) {
        const view = (_d = (_c = message.cmdInfo) == null ? void 0 : _c.at(splitScreenIndex)) == null ? void 0 : _d.viewOrigin;
        const result = demo.messages.find((msg) => {
          var _a2, _b2;
          if (!(msg instanceof Packet)) {
            return false;
          }
          const match = (_b2 = (_a2 = msg.cmdInfo) == null ? void 0 : _a2.at(splitScreenIndex)) == null ? void 0 : _b2.viewOrigin;
          return Math.abs(((match == null ? void 0 : match.x) ?? 0) - ((view == null ? void 0 : view.x) ?? 0)) <= viewTolerance && Math.abs(((match == null ? void 0 : match.y) ?? 0) - ((view == null ? void 0 : view.y) ?? 0)) <= viewTolerance && Math.abs(((match == null ? void 0 : match.z) ?? 0) - ((view == null ? void 0 : view.z) ?? 0)) <= viewTolerance;
        });
        if (result !== void 0) {
          syncedTicks.push({
            source: message.tick,
            destination: result.tick,
            delta: Math.abs((message.tick ?? 0) - result.tick),
            x: (_g = (_f = (_e = message.cmdInfo) == null ? void 0 : _e.at(splitScreenIndex)) == null ? void 0 : _f.viewOrigin) == null ? void 0 : _g.x,
            y: (_j = (_i = (_h = message.cmdInfo) == null ? void 0 : _h.at(splitScreenIndex)) == null ? void 0 : _i.viewOrigin) == null ? void 0 : _j.y,
            z: (_m = (_l = (_k = message.cmdInfo) == null ? void 0 : _k.at(splitScreenIndex)) == null ? void 0 : _l.viewOrigin) == null ? void 0 : _m.z
          });
        }
      }
    }
    return syncedTicks;
  }
};

// node_modules/@nekz/sdp/esm/src/parser.js
var DefaultParsingOptions = {
  header: true,
  messages: true,
  stringTables: false,
  dataTables: false,
  packets: false,
  userCmds: false
};
var SourceDemoParser = class {
  constructor(options = DefaultParsingOptions) {
    Object.defineProperty(this, "options", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.options = options;
  }
  static default() {
    return new this(DefaultParsingOptions);
  }
  setOptions(options) {
    this.options = {
      ...this.options,
      ...options
    };
    return this;
  }
  prepare(buffer) {
    const extended = new Uint8Array(buffer.byteLength + 4 - buffer.byteLength % 4);
    extended.set(new Uint8Array(buffer), 0);
    return new SourceDemoBuffer(extended.buffer);
  }
  parse(buffer) {
    var _a;
    const buf = this.prepare(buffer);
    const demo = SourceDemo.default();
    if (this.options.header)
      demo.readHeader(buf);
    if (this.options.messages)
      demo.readMessages(buf);
    if ((_a = demo.messages) == null ? void 0 : _a.length) {
      if (this.options.stringTables)
        demo.readStringTables();
      if (this.options.dataTables)
        demo.readDataTables();
      if (this.options.packets)
        demo.readPackets();
      if (this.options.userCmds)
        demo.readUserCmds();
    }
    return demo;
  }
  save(demo, bufferSize) {
    var _a;
    if (!this.options.header || !this.options.header) {
      throw new Error("Cannot save demo without parsed header and messages.");
    }
    if ((_a = demo.messages) == null ? void 0 : _a.length) {
      if (this.options.stringTables)
        demo.writeStringTables();
      if (this.options.dataTables)
        demo.writeDataTables();
      if (this.options.packets)
        demo.writePackets();
      if (this.options.userCmds)
        demo.writeUserCmds();
    }
    const padding = 4 - bufferSize % 4;
    const extended = new Uint8Array(bufferSize + padding);
    const buf = new SourceDemoBuffer(extended.buffer);
    demo.writeHeader(buf);
    demo.writeMessages(buf);
    const result = new Uint8Array(bufferSize);
    result.set(extended.slice(0, bufferSize), 0);
    return result;
  }
};
export {
  AchievementEvent,
  AddLocator,
  AmmoDenied,
  ApplyHitBoxDamageEffect,
  Battery,
  ChallengeModeCheatSession,
  ChallengeModeCloseAllUI,
  ChangePaintColor,
  CloseCaption,
  CloseCaptionDirect,
  CmdInfo,
  ControlHelperAnimate,
  CreditsMsg,
  CreditsPortalMsg,
  CreditsType,
  CurrentTimescale,
  Damage,
  DataTables_exports as DataTables,
  DefaultParsingOptions,
  DemoMessages,
  DesiredTimescale,
  Fade,
  Flash,
  GameEvent,
  GameEventDescriptor,
  GameEventManager,
  GameTimescaleInterpolators,
  GameTitle,
  Geiger,
  HintText,
  HudMsg,
  HudPingIndicator,
  HudPrint,
  HudText,
  IndicatorFlash,
  InventoryFlash,
  ItemPickup,
  KeyHintText,
  LogoTimeMsg,
  MPAllTauntsLocked,
  MPMapCompleted,
  MPMapCompletedData,
  MPMapIncomplete,
  MPTauntEarned,
  MPTauntLocked,
  MPTauntUnlocked,
  messages_exports as Messages,
  NetMessages_exports as NetMessages,
  OpenRadialMenu,
  PaintAllSurfaces,
  PaintBombExplode,
  PaintEntity,
  PaintWorld,
  Portal2EngineGameMods,
  PortalCreditsType,
  PortalFX_Surface,
  PortalFizzleType,
  QAngle,
  RemoveAllPaint,
  RemovePaint,
  RequestState,
  ResetHUD,
  Rumble,
  SayText,
  SayText2,
  ScoreboardTempUpdate,
  SetMixLayerTriggerFactor,
  Shake,
  ShakeCommand,
  ShowMenu,
  SoundFlags,
  SoundInfo,
  SourceDemo,
  SourceDemoBuffer,
  SourceDemoParser,
  SquadMemberDied,
  StartSurvey,
  StringTables_exports as StringTables,
  TakePhoto,
  TextMsg,
  Tilt,
  Train,
  TransitionFade,
  UpdateJalopyRadar,
  UserCmd,
  UserMessage,
  UserMessages,
  VGUIMenu,
  Vector,
  VoiceMask
};
//# sourceMappingURL=@nekz_sdp.js.map
