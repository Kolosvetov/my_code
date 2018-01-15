<?php

/* /src/block/common/price-table/price-table.html.twig */
class __TwigTemplate_8d264d7617a02c8a03aaed3f7056cbc0279b8f2d85b69ebe1b9f398a07ab2d68 extends Twig_Template
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
        echo "<div class=\"inner-row margin-40\"><h2>Цены</h2></div>
<div class=\"inner-row\">
\t<table class=\"c-price\">
\t\t<tr>
\t\t\t<th>Наименование услуги</th>
\t\t\t<th>цена (руб.)</th>
\t\t</tr>
\t\t";
        // line 8
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["priceList"]) ? $context["priceList"] : null));
        foreach ($context['_seq'] as $context["_key"] => $context["price"]) {
            // line 9
            echo "\t\t\t<tr>
\t\t\t\t<td>";
            // line 10
            echo $this->getAttribute($context["price"], "title", array(), "method");
            echo "</td>
\t\t\t\t<td>";
            // line 11
            echo $this->getAttribute($context["price"], "sum", array());
            echo "</td>
\t\t\t</tr>
\t\t";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['price'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 14
        echo "\t</table>
</div>
";
    }

    public function getTemplateName()
    {
        return "/src/block/common/price-table/price-table.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  48 => 14,  39 => 11,  35 => 10,  32 => 9,  28 => 8,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/src/block/common/price-table/price-table.html.twig", "/projects/webpages/projects/oncology-centr/site/oncology-centr.ru/www/local/templates/oncology/frontend/src/block/common/price-table/price-table.html.twig");
    }
}
