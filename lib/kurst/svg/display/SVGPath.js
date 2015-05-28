import SVGPathCommandDef from "./../data/SVGPathCommandDef";
import SVGPathCommand from "./../data/SVGPathCommand";
class SVGPath extends SVGDisplayObjectBase {
    constructor() {
        super();
        this.commands = new Array();
        this.relative = false;
        this.drawOnCommand = true;
        this.initElement('path');
    }
    addDrawCommand(command, ...params) {
        if (params) {
            this.commands.push(new SVGPathCommand(command.code, params));
        }
        else {
            this.commands.push(new SVGPathCommand(command.code));
        }
        if (this.drawOnCommand) {
            this.draw();
        }
    }
    clear() {
        this.commands.length = 0;
        this.draw();
    }
    draw() {
        if (this.commands.length == 0) {
            this.element.removeAttribute('d');
            return;
        }
        var str = '';
        var l = this.commands.length;
        var cmd;
        var code;
        var cmdP;
        var cmdL;
        for (var c = 0; c < l; c++) {
            cmd = this.commands[c];
            code = cmd.code;
            code = (this.relative) ? code.toLowerCase() : code.toUpperCase();
            cmdP = cmd.params;
            cmdL = cmdP.length;
            str += (c == 0) ? code : ' ' + code;
            for (var d = 0; d < cmdL; d++) {
                str += ' ' + cmdP[d];
            }
        }
        this.element.setAttribute('d', str);
    }
}
SVGPath.moveto = new SVGPathCommandDef('M', 'Move To');
SVGPath.lineto = new SVGPathCommandDef('L', 'Line To');
SVGPath.hlineto = new SVGPathCommandDef('H', 'Horizontal Lineto');
SVGPath.vlineto = new SVGPathCommandDef('V', 'Vertical Lineto');
SVGPath.curveto = new SVGPathCommandDef('C', 'Curve To');
SVGPath.smoothcurveto = new SVGPathCommandDef('S', 'Smooth Curveto');
SVGPath.quadratic = new SVGPathCommandDef('Q', 'Quadratic Bézier Curve');
SVGPath.smoothquadratic = new SVGPathCommandDef('T', 'Smooth Quadratic Bézier Curve');
SVGPath.arc = new SVGPathCommandDef('A', 'Elliptical Arc');
SVGPath.close = new SVGPathCommandDef('Z', 'Close Path');
