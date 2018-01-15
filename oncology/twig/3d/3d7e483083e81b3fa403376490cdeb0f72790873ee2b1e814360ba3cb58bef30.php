<?php

/* /src/block/common/diseases/diseases.html.twig */
class __TwigTemplate_e03745d418b2d9d54b6026d783e429cd5e27893d927636a468a1524e89c71401 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<div class=\"inner-row col-2 margin-60 c-what-we-treat\">
\t<h2>Что мы лечим</h2>
\t<div class=\"inner-col\">
\t\t";
        // line 4
        echo (isset($context["diseaseText"]) ? $context["diseaseText"] : null);
        echo "
\t</div>
\t<div class=\"inner-col\">
\t\t<img src=\"";
        // line 7
        echo (isset($context["img"]) ? $context["img"] : null);
        echo "\">
\t</div>
</div>

";
        // line 11
        if ((isset($context["not_hidden"]) ? $context["not_hidden"] : null)) {
            // line 12
            echo "\t<div class=\"b-sections inner-row disease-list\">
\t\t";
            // line 13
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable((isset($context["diseaseList"]) ? $context["diseaseList"] : null));
            foreach ($context['_seq'] as $context["_key"] => $context["disease"]) {
                // line 14
                echo "\t\t\t";
                if (($this->getAttribute($this->getAttribute($context["disease"], "is_link", array()), "value", array(), "method") == "yes")) {
                    // line 15
                    echo "\t\t\t\t<a href=\"";
                    echo $this->getAttribute($context["disease"], "url", array(), "method");
                    echo "\"><span>";
                    echo $this->getAttribute($context["disease"], "title", array(), "method");
                    echo "</span></a>
\t\t\t";
                } else {
                    // line 17
                    echo "\t\t\t\t<a class=\"not-link\"><span>";
                    echo $this->getAttribute($context["disease"], "title", array(), "method");
                    echo "</span></a>
\t\t\t";
                }
                // line 19
                echo "\t\t";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['disease'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 20
            echo "\t</div>
";
        } else {
            // line 22
            echo "\t<div class=\"b-sections inner-row disease-list\">
\t\t";
            // line 23
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable((isset($context["diseaseList"]) ? $context["diseaseList"] : null));
            $context['loop'] = array(
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            );
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["_key"] => $context["disease"]) {
                // line 24
                echo "\t\t\t";
                if (($this->getAttribute($this->getAttribute($context["disease"], "is_link", array()), "value", array(), "method") == "yes")) {
                    // line 25
                    echo "\t\t\t\t<a href=\"";
                    echo $this->getAttribute($context["disease"], "url", array(), "method");
                    echo "\" ";
                    if (($this->getAttribute($context["loop"], "index", array()) > 8)) {
                        echo " style=\"display:none\" ";
                    }
                    echo " ><span>";
                    echo $this->getAttribute($context["disease"], "title", array(), "method");
                    echo "</span></a>
\t\t\t";
                } else {
                    // line 27
                    echo "\t\t\t\t<a class=\"not-link\" ";
                    if (($this->getAttribute($context["loop"], "index", array()) > 8)) {
                        echo " style=\"display:none\" ";
                    }
                    echo " ><span>";
                    echo $this->getAttribute($context["disease"], "title", array(), "method");
                    echo "</span></a>
\t\t\t";
                }
                // line 29
                echo "\t\t";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['disease'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 30
            echo "\t\t<a class=\"disease-list__show-more\" style=\"display: none\">
\t\t\t<span>Показать еще</span>
\t\t</a>
\t</div>
";
        }
    }

    public function getTemplateName()
    {
        return "/src/block/common/diseases/diseases.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  132 => 30,  118 => 29,  108 => 27,  96 => 25,  93 => 24,  76 => 23,  73 => 22,  69 => 20,  63 => 19,  57 => 17,  49 => 15,  46 => 14,  42 => 13,  39 => 12,  37 => 11,  30 => 7,  24 => 4,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/src/block/common/diseases/diseases.html.twig", "/projects/webpages/projects/oncology-centr/site/oncology-centr.ru/www/local/templates/oncology/frontend/src/block/common/diseases/diseases.html.twig");
    }
}
